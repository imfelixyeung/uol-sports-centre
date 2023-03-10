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
