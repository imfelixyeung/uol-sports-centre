import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {StatusReportResponse} from './types/status';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),
  tagTypes: [],
  endpoints: builder => ({
    getStatusReport: builder.query<StatusReportResponse, void>({
      query: () => '/status/report',
    }),
  }),
});

export const {useGetStatusReportQuery} = api;
