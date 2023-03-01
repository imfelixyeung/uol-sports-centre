import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {
  GetSessionResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
} from './types/auth';
import {StatusReportResponse} from './types/status';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),
  tagTypes: [],
  endpoints: builder => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: credentials => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: credentials => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),

    getSession: builder.query<GetSessionResponse, void>({
      query: () => '/auth/session',
    }),

    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenRequest>({
      query: () => ({
        url: '/auth/token',
        method: 'POST',
      }),
    }),

    getStatusReport: builder.query<StatusReportResponse, void>({
      query: () => '/status/report',
    }),
  }),
});

export const {
  useGetStatusReportQuery,
  useGetSessionQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
} = api;
