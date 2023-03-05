import axios from 'axios';
import {HealthCheckRegistry} from '../persistence/health-check';
import {ServiceRegistry} from '../persistence/service';
import {ServiceStatusSnapshot} from '../types/status';

const getServiceHealthCheck = async (
  service: string
): Promise<ServiceStatusSnapshot> => {
  const serviceHealthCheckEndpoint = `http://${service}/health`;

  const timestamp = Date.now();
  try {
    const {status} = await axios(serviceHealthCheckEndpoint, {
      // only throw errors if connection fails
      validateStatus: () => true,
    });

    // service is running phenomenally
    if (status === 200)
      return {service, status: 'up', statusCode: status, timestamp};

    // service is running but not as good as it should be
    return {service, status: 'degraded', statusCode: status, timestamp};
  } catch (error) {
    // unable to reach service, service is considered down
    return {service, status: 'down', statusCode: 503, timestamp};
  }
};

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
