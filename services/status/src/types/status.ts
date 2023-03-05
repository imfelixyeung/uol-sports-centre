export type Status = 'up' | 'down' | 'degraded';

export interface ServiceStatusSnapshot {
  service: string;
  status: Status;
  statusCode: number;
  timestamp: number;
}
