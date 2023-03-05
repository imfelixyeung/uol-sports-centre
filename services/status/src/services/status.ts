import axios from 'axios';
import {HealthCheckRegistry} from '../persistence/health-check';
import {ServiceRegistry} from '../persistence/service';
import {ServiceStatusSnapshot} from '../types/status';

type Report = ServiceStatusSnapshot[];

/**
 * Gets the health check endpoint for a given service
 * @param service service name
 * @returns endpoint
 */
const getServiceHealthCheckEndpoint = (service: string) => {
  return `http://${service}/health`;
};

const getServiceReport = async (
  service: string
): Promise<ServiceStatusSnapshot> => {
  const serviceHealthCheckEndpoint = getServiceHealthCheckEndpoint(service);

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

export const getStatusReport = async () => {
  // get reports for all services
  const services = await ServiceRegistry.getServices();
  const reportPromises = services.map(getServiceReport);
  const reports: Report = await Promise.all(reportPromises);
  return reports;
};

export const getLatestReport = async () => {
  const latest = await HealthCheckRegistry.getLatest();
  return latest.map(({healthChecks, name}) => {
    return {
      service: name,
      status: healthChecks[0]?.status ?? null,
      statusCode: healthChecks[0]?.statusCode ?? null,
      timestamp: healthChecks[0]?.timestamp.getTime() ?? null,
    };
  });
};

export const getStatusHistory = async () => {
  return await HealthCheckRegistry.getHistory();
};

export const takeServicesStatusSnapshot = async () => {
  const report = await getStatusReport();
  for (const data of report) {
    await HealthCheckRegistry.addServiceHealthCheck(data);
  }
};

export const removeOldSnapshots = async () => {
  await HealthCheckRegistry.removeOldHealthChecks();
};

export const registerServices = async (services: string[]) => {
  for (const service of services) await ServiceRegistry.addService(service);
};
