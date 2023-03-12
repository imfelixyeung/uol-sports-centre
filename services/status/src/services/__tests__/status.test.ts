import {axiosMock} from '~/lib/__mocks__/axios.mock';
import {dbMock} from '~/utils/__mocks__/db.mock';
import {
  getLatestReport,
  getServiceHealthCheck,
  getServicesHealthCheck,
  getStatusHistory,
  registerServices,
  removeOldHealthCheckSnapshots,
  takeServicesHealthCheckSnapshot,
} from '../status';

describe('getServiceHealthCheck', () => {
  getServiceHealthCheck;

  const serviceName = 'service';
  const serviceHealthCheckEndpoint = `http://${serviceName}/health`;

  it('returns service up if reachable and 200', async () => {
    const statusCode = 200;
    axiosMock.get.mockResolvedValue({status: statusCode});

    const result = await getServiceHealthCheck(serviceName);
    expect(axiosMock.get).toBeCalledWith(
      serviceHealthCheckEndpoint,
      expect.anything()
    );
    expect(result).toEqual(
      expect.objectContaining({
        service: serviceName,
        status: 'up',
        statusCode: statusCode,
      })
    );
  });

  it('returns service degraded if reachable and not 200', async () => {
    const statusCode = 500;
    axiosMock.get.mockResolvedValue({status: statusCode});

    const result = await getServiceHealthCheck(serviceName);
    expect(axiosMock.get).toBeCalledWith(
      serviceHealthCheckEndpoint,
      expect.anything()
    );
    expect(result).toEqual(
      expect.objectContaining({
        service: serviceName,
        status: 'degraded',
        statusCode: statusCode,
      })
    );
  });

  it('returns service down if unreachable', async () => {
    axiosMock.get.mockRejectedValue(new Error());

    const result = await getServiceHealthCheck(serviceName);
    expect(axiosMock.get).toBeCalledWith(
      serviceHealthCheckEndpoint,
      expect.anything()
    );
    expect(result).toEqual(
      expect.objectContaining({
        service: serviceName,
        status: 'down',
        statusCode: 503,
      })
    );
  });
});

describe('getLatestReport', () => {
  getLatestReport;
  it('returns the formatted latest report', async () => {
    const now = new Date();
    dbMock.service.findMany.mockResolvedValue([
      {
        name: 'service',
        healthChecks: [
          {
            timestamp: now,
            status: 'up',
            statusCode: 200,
          },
        ],
      },
    ] as any);

    const latest = await getLatestReport();
    expect(latest).toEqual([
      {
        service: 'service',
        timestamp: now.getTime(),
        status: 'up',
        statusCode: 200,
      },
    ]);
  });
});

describe('getServicesHealthCheck', () => {
  getServicesHealthCheck;
  it.todo('returns formatted health check report for all registered services');
});

describe('getStatusHistory', () => {
  getStatusHistory;
  it.todo('returns the status history for all registered services');
});

describe('registerServices', () => {
  registerServices;
  it.todo('upsert the service to database');
});

describe('removeOldHealthCheckSnapshots', () => {
  removeOldHealthCheckSnapshots;
  it.todo('removes old status snapshots');
});

describe('takeServicesHealthCheckSnapshot', () => {
  takeServicesHealthCheckSnapshot;
  it.todo('should take a snapshot of all registered services and store it');
});
