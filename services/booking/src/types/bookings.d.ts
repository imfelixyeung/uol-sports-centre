import {PaginationFilter, TimeLimitFilter} from '.';

export enum BookingsSort {
  DateAsc,
  DateDsc,
  // ...etc
}

export interface BookingsFilter extends PaginationFilter, TimeLimitFilter {
  user?: number;
  facility?: number;
  activity?: number;
  start?: number;
  end?: number;
  sort?: BookingsSort;
  event?: number;
}
