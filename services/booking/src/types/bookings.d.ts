export enum BookingsSort {
  DateAsc,
  DateDsc,
  // ...etc
}

export interface BookingsFilter {
  page?: number;
  limit?: number;
  start?: number;
  end?: number;
  user?: number;
  facility?: number;
  activity?: number;
  sort?: BookingsSort;
  event?: number;
}
