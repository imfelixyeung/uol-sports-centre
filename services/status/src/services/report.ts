import axios from 'axios';

const knownServices = [
  'auth',
  'booking',
  'facilities',
  'management',
  'payments',
  'status',
  'users',
  'web',
] as const;

type Service = (typeof knownServices)[number];
type Status = 'up' | 'down' | 'degraded';

interface ServiceReport {
  service: Service;
  status: Status;
  statusCode: number;
  timestamp: number;
}

type Report = ServiceReport[];

/**
 * Gets the health check endpoint for a given service
 * @param service service name
 * @returns endpoint
 */
const getServiceHealthCheckEndpoint = (service: Service) => {
  return `http://${service}/health`;
};

const getServiceReport = async (service: Service): Promise<ServiceReport> => {
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

export const getReport = async () => {
  // get reports for all services
  const reportPromises = knownServices.map(getServiceReport);
  const reports: Report = await Promise.all(reportPromises);
  return reports;
};
