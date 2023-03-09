export interface StatusReportResponse {
  success: boolean;
  data: ServiceStatus[];
}

export interface ServiceStatus {
  service: string;
  status: 'up' | 'down' | 'degraded';
  statusCode: number;
  timestamp: number;
}
