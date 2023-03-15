export interface EventDTO {
  id: number;
  name: string;
  activityId: number;
  day: number;
  time: number;
  duration: number;
  type: 'SESSION' | 'OPEN_USE' | 'TEAM_EVENT';
}

export interface CreateEventDTO {
  name: string;
  activityId: number;
  day: number;
  time: number;
  duration: number;
  type: 'SESSION' | 'OPEN_USE' | 'TEAM_EVENT';
}
