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
  // TODO: Mock axios
  it.todo('returns service up if reachable and 200');
  it.todo('returns service degraded if reachable and not 200');
  it.todo('returns service down if unreachable');
});

describe('getLatestReport', () => {
  getLatestReport;
  it.todo('returns the formatted latest report');
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
