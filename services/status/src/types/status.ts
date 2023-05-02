export type Status = 'up' | 'down' | 'degraded';

export interface ServiceStatusSnapshot {
  // id of the service
  service: string;

  // status of the service
  status: Status;

  // status code of the service
  statusCode: number;

  // timestamp of the snapshot
  timestamp: number;
}
