import {Service} from '@prisma/client';
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

  it('returns formatted health check report for all registered services', async () => {
    axiosMock.get.mockResolvedValue({status: 200});
    dbMock.service.findMany.mockResolvedValue([
      {name: 'service1'},
      {name: 'service2'},
      {name: 'service3'},
    ] as Service[]);

    const result = await getServicesHealthCheck();
    expect(result).toEqual([
      expect.objectContaining({
        service: 'service1',
        status: 'up',
        statusCode: 200,
        timestamp: expect.any(Number),
      }),
      expect.objectContaining({
        service: 'service2',
        status: 'up',
        statusCode: 200,
        timestamp: expect.any(Number),
      }),
      expect.objectContaining({
        service: 'service3',
        status: 'up',
        statusCode: 200,
        timestamp: expect.any(Number),
      }),
    ]);
  });
});

describe('getStatusHistory', () => {
  getStatusHistory;

  it('returns empty list if not history', () => {
    dbMock.service.findMany.mockResolvedValue([]);
    expect(getStatusHistory()).resolves.toEqual([]);
    expect(dbMock.service.findMany).toBeCalled();
  });

  it('returns the status history for all registered services', () => {
    const servicesWithHealthChecks = [
      {
        name: 'service1',
        healthChecks: [
          {
            timestamp: new Date(),
            status: 'up',
            statusCode: 200,
          },
          {
            timestamp: new Date(),
            status: 'up',
            statusCode: 200,
          },
          {
            timestamp: new Date(),
            status: 'up',
            statusCode: 200,
          },
        ],
      },
      {
        name: 'service2',
        healthChecks: [
          {
            timestamp: new Date(),
            status: 'up',
            statusCode: 200,
          },
          {
            timestamp: new Date(),
            status: 'up',
            statusCode: 200,
          },
          {
            timestamp: new Date(),
            status: 'up',
            statusCode: 200,
          },
        ],
      },
    ];
    dbMock.service.findMany.mockResolvedValue(servicesWithHealthChecks as any);
    expect(getStatusHistory()).resolves.toEqual(servicesWithHealthChecks);
  });
});

describe('registerServices', () => {
  registerServices;

  it('upsert the service to database', async () => {
    dbMock.service.upsert.mockResolvedValue({
      id: 1,
      name: 'service',
      createdAt: new Date(),
    });

    const services = ['service', 'service', 'service'];
    await registerServices(services);

    expect(dbMock.service.upsert).toBeCalledTimes(services.length);
  });
});

describe('removeOldHealthCheckSnapshots', () => {
  removeOldHealthCheckSnapshots;

  it('removes old status snapshots', async () => {
    await removeOldHealthCheckSnapshots();
    expect(dbMock.healthCheck.deleteMany).toBeCalled();
  });
});

describe('takeServicesHealthCheckSnapshot', () => {
  takeServicesHealthCheckSnapshot;

  it('should take a snapshot of all registered services and store it', async () => {
    const services = [
      {name: 'service1'},
      {name: 'service2'},
      {name: 'service3'},
    ] as Service[];

    axiosMock.get.mockResolvedValue({status: 200});
    dbMock.service.findMany.mockResolvedValue(services);

    await takeServicesHealthCheckSnapshot();

    expect(dbMock.service.update).toBeCalledTimes(services.length);
  });
});
