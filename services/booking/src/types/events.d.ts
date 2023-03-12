export interface EventsFilter {
  start?: number;
  end?: number;
  facility?: number;
  activity?: number;
  type?: 'SESSION' | 'OPEN_USE' | 'TEAM_EVENT';
}
