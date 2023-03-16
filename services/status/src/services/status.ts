import axios from 'axios';
import {HealthCheckRegistry} from '~/persistence/health-check';
import {ServiceRegistry} from '~/persistence/service';
import {healthCheckSchema} from '~/schema/health-check';
import {ServiceStatusSnapshot} from '~/types/status';

/**
 * attempts to query the service's health check endpoint
 * @param service id of the service to check
 * @returns information about the service's health
 */
export const getServiceHealthCheck = async (
  service: string
): Promise<ServiceStatusSnapshot> => {
  const serviceHealthCheckEndpoint = `http://${service}/health`;

  const timestamp = Date.now();

  const createSnapshot = (
    statusStr: ServiceStatusSnapshot['status'],
    statusCode: number
  ) => ({
    service,
    status: statusStr,
    statusCode: statusCode,
    timestamp,
  });

  try {
    const {status, data} = await axios.get(serviceHealthCheckEndpoint, {
      // only throw errors if connection fails
      validateStatus: () => true, // ensures errors are thrown only if connection fails
    });

    if (status !== 200) {
      // service is returning invalid status code but is still running
      return createSnapshot('degraded', status);
    }

    const parsedData = healthCheckSchema.safeParse(data);
    if (!parsedData.success) {
      // service is returning invalid data but is still running
      return createSnapshot('degraded', status);
    }

    if (parsedData.data.status === 'degraded') {
      // service is running but not as good as it should be
      return createSnapshot('degraded', status);
    }

    // service is running phenomenally
    return createSnapshot('up', status);
  } catch (error) {
    // unable to reach service, service is considered down
    return createSnapshot('down', 503);
  }
};

/**
 * queries all registered services' health check endpoint
 * @returns health check info for all registered services
 */
export const getServicesHealthCheck = async () => {
  // get reports for all services
  const services = await ServiceRegistry.getServices();

  const healthCheckPromises = services.map(getServiceHealthCheck);
  const healthChecks = await Promise.all(healthCheckPromises);

  return healthChecks;
};

/**
 * gets the latest health check report of each registered service
 * @returns latest health check report of each registered service
 */
export const getLatestReport = async () => {
  const latest = await HealthCheckRegistry.getLatest();
  return latest.map(({healthChecks, name}) => {
    const latest = healthChecks[0];

    return {
      service: name,
      status: latest?.status ?? null,
      statusCode: latest?.statusCode ?? null,
      timestamp: latest?.timestamp.getTime() ?? null,
    };
  });
};

/**
 * gets the health check history of each registered service
 * @returns health check history
 */
export const getStatusHistory = async () => {
  return await HealthCheckRegistry.getHistory();
};

/**
 * takes a snapshot of all services' health check
 */
export const takeServicesHealthCheckSnapshot = async () => {
  const report = await getServicesHealthCheck();
  for (const data of report) {
    await HealthCheckRegistry.addServiceHealthCheck(data);
  }
};

/**
 * remove old health check snapshots
 */
export const removeOldHealthCheckSnapshots = async () => {
  await HealthCheckRegistry.removeOldHealthChecks();
};

/**
 * register services that should be monitored
 * @param services list of services to register
 */
export const registerServices = async (services: string[]) => {
  for (const service of services) await ServiceRegistry.addService(service);
};
