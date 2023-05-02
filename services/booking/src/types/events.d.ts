import {EventType} from '@prisma/client';
import {TimeLimitFilter} from '.';

export interface EventsFilter extends TimeLimitFilter {
  facility?: number;
  activity?: number;
  type?: EventType;
}
