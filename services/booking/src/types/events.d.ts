import {TimeLimitFilter} from '.';

export interface EventsFilter extends TimeLimitFilter {
  facility?: number;
  activity?: number;
  type?: 'SESSION' | 'OPEN_USE' | 'TEAM_EVENT';
}
