import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import type {
  GetSessionResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
} from './types/auth';
import type {
  FacilitiesResponse,
  FacilityActivitiesResponse,
  FacilityActivityResponse,
  FacilityResponse,
  FacilityTimeResponse,
  FacilityTimesResponse,
} from './types/facilities';
import type {StatusReportResponse} from './types/status';

interface Token {
  token: string;
}

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

    logout: builder.mutation<void, Token>({
      query: ({token}) => ({
        url: '/auth/logout',
        method: 'POST',
        headers: {Authorization: `Bearer ${token}`},
      }),
    }),

    getSession: builder.query<GetSessionResponse, Token>({
      query: ({token}) => ({
        url: '/auth/session',
        headers: {Authorization: `Bearer ${token}`},
      }),
    }),

    refreshToken: builder.mutation<
      RefreshTokenResponse,
      RefreshTokenRequest & Token
    >({
      query: ({token, ...data}) => ({
        url: '/auth/token',
        method: 'POST',
        body: data,
        headers: {Authorization: `Bearer ${token}`},
      }),
    }),

    getStatusReport: builder.query<StatusReportResponse, void>({
      query: () => '/status/report',
    }),

    getFacilities: builder.query<FacilitiesResponse, void>({
      query: () => '/facilities/facilities/',
    }),

    getFacility: builder.query<FacilityResponse, number>({
      query: facilityId => `/facilities/facilities/${facilityId}`,
    }),

    getFacilityTimes: builder.query<FacilityTimesResponse, void>({
      query: () => '/facilities/times/',
    }),

    getFacilityTime: builder.query<FacilityTimeResponse, number>({
      query: timeId => `/facilities/times/${timeId}`,
    }),

    getFacilityActivities: builder.query<FacilityActivitiesResponse, void>({
      query: () => '/facilities/activities/',
    }),

    getFacilityActivity: builder.query<FacilityActivityResponse, number>({
      query: activityId => `/facilities/activities/${activityId}`,
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
  useGetFacilitiesQuery,
  useGetFacilityQuery,
  useGetFacilityActivitiesQuery,
  useGetFacilityActivityQuery,
  useGetFacilityTimesQuery,
  useGetFacilityTimeQuery,
} = api;
