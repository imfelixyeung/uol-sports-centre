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

// note: type casting is used when mocking the db to prevent type errors
// prisma queries' return types differs when different queries are used

// expected responses for the health check endpoints
const healthyResponse = {status: 'healthy'};
const degradedResponse = {status: 'degraded'};

describe('getServiceHealthCheck', () => {
  getServiceHealthCheck;

  const serviceName = 'service';
  const serviceHealthCheckEndpoint = `http://${serviceName}/health`;

  it('returns service up if reachable and 200', async () => {
    // mocks the axios client to resolve with 200 code
    const statusCode = 200;
    axiosMock.get.mockResolvedValue({
      status: statusCode,
      data: healthyResponse,
    });

    // tries getting the health check
    const result = await getServiceHealthCheck(serviceName);

    // check if the expected endpoint is being used
    expect(axiosMock.get).toBeCalledWith(
      serviceHealthCheckEndpoint,
      expect.anything()
    );

    // checks if the result contains the service name,
    // 200 status and is indicated as 'up'
    expect(result).toEqual(
      expect.objectContaining({
        service: serviceName,
        status: 'up',
        statusCode: statusCode,
      })
    );
  });

  it('returns service degraded if reachable and not 200', async () => {
    // mocks the axios client to resolve with 500 code
    const statusCode = 500;
    axiosMock.get.mockResolvedValue({
      status: statusCode,
      data: degradedResponse,
    });

    // tries getting the health check
    const result = await getServiceHealthCheck(serviceName);

    // check if the expected endpoint is being used
    expect(axiosMock.get).toBeCalledWith(
      serviceHealthCheckEndpoint,
      expect.anything()
    );

    // checks if the result contains the service name,
    // 500 status and is indicated as 'degraded'
    expect(result).toEqual(
      expect.objectContaining({
        service: serviceName,
        status: 'degraded',
        statusCode: statusCode,
      })
    );
  });

  it('returns service down if unreachable', async () => {
    // mocks the axios client to reject (unreachable)
    axiosMock.get.mockRejectedValue(new Error());

    // tries getting the health check
    const result = await getServiceHealthCheck(serviceName);

    // check if the expected endpoint is being used
    expect(axiosMock.get).toBeCalledWith(
      serviceHealthCheckEndpoint,
      expect.anything()
    );

    // checks if the result contains the service name,
    // 503 status (service unavailable) and is indicated as 'down'
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

    // mock the service's latest snapshot
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
    ] as any); // casting to any to prevent type errors

    const latest = await getLatestReport();

    // checks if the correct service is being returned with expected values
    expect(latest).toEqual([
      {
        service: 'service',
        timestamp: now.getTime(),
        status: 'up',
        statusCode: 200,
      },
    ]);
  });

  it('returns null if no healthcheck snapshots', async () => {
    // mocks the service's has no prior snapshots
    dbMock.service.findMany.mockResolvedValue([
      {name: 'service', healthChecks: []},
    ] as any); // casting to any to prevent type errors

    const latest = await getLatestReport();

    // expect the fields related to the latest snapshot to be null
    expect(latest).toEqual([
      {
        service: 'service',
        timestamp: null,
        status: null,
        statusCode: null,
      },
    ]);
  });
});

describe('getServicesHealthCheck', () => {
  getServicesHealthCheck;

  it('returns formatted health check report for all registered services', async () => {
    // mocks the axios client to resolve with 200 code
    axiosMock.get.mockResolvedValue({
      status: 200,
      data: healthyResponse,
    });
    dbMock.service.findMany.mockResolvedValue([
      {name: 'service1'},
      {name: 'service2'},
      {name: 'service3'},
    ] as Service[]); // casting to Service[] so other fields don't cause type errors

    // expect all services to be up
    const result = await getServicesHealthCheck();

    const commonResult = {
      status: 'up',
      statusCode: 200,
      timestamp: expect.any(Number),
    };

    expect(result).toEqual([
      expect.objectContaining({
        service: 'service1',
        ...commonResult,
      }),
      expect.objectContaining({
        service: 'service2',
        ...commonResult,
      }),
      expect.objectContaining({
        service: 'service3',
        ...commonResult,
      }),
    ]);
  });
});

describe('getStatusHistory', () => {
  getStatusHistory;

  it('returns empty list if not history', () => {
    // mocks the services has no prior snapshots
    dbMock.service.findMany.mockResolvedValue([]);

    // expect the status history to be empty
    expect(getStatusHistory()).resolves.toEqual([]);

    // expect findMany to have been called
    expect(dbMock.service.findMany).toBeCalled();
  });

  it('returns the status history for all registered services', () => {
    // mocks the db return, and expects the exact same result

    const healthCheck = {
      timestamp: new Date(),
      status: 'up',
      statusCode: 200,
    };

    const servicesWithHealthChecks = [
      {
        name: 'service1',
        healthChecks: [{...healthCheck}, {...healthCheck}, {...healthCheck}],
      },
      {
        name: 'service2',
        healthChecks: [{...healthCheck}, {...healthCheck}, {...healthCheck}],
      },
    ];
    dbMock.service.findMany.mockResolvedValue(servicesWithHealthChecks as any);
    expect(getStatusHistory()).resolves.toEqual(servicesWithHealthChecks);
  });
});

describe('registerServices', () => {
  registerServices;

  const serviceName = 'service';

  it('upsert the service to database', async () => {
    // upsert should always resolves
    dbMock.service.upsert.mockResolvedValue({
      id: 1,
      name: serviceName,
      createdAt: new Date(),
    });

    const services = [serviceName, serviceName, serviceName];
    await registerServices(services);

    // 3 services means 3 upserts
    expect(dbMock.service.upsert).toBeCalledTimes(services.length);
  });
});

describe('removeOldHealthCheckSnapshots', () => {
  removeOldHealthCheckSnapshots;

  it('removes old status snapshots', async () => {
    // simple check to see if deleteMany was called after the function is called
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

    // mocks the axios client to resolve
    axiosMock.get.mockResolvedValue({status: 200, data: healthyResponse});

    // mocks the database to return some services
    dbMock.service.findMany.mockResolvedValue(services);

    await takeServicesHealthCheckSnapshot();

    // after taking snapshot, the service should be updated the same number
    // of times as the number of services
    expect(dbMock.service.update).toBeCalledTimes(services.length);
  });
});
