export interface Status {
  status: 'OK' | 'error';
}

export interface Pagination {
  metadata: {
    count: number;
    limit: number;
    page: number;
    pageCount: number;
  };
}

export interface PaginationFilter {
  page?: number;
  limit?: number;
}

export interface TimeLimitFilter {
  start?: number;
  end?: number;
}

export type RequiredTimeLimitFilter = Required<TimeLimitFilter>;
