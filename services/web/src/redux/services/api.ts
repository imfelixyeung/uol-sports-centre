import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import type {
  GetSessionResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  UpdateUserRoleRequest,
} from './types/auth';
import type {
  BookingAvailabilityRequest,
  BookingAvailabilityResponse,
} from './types/bookings';
import type {
  FacilitiesResponse,
  FacilityActivitiesResponse,
  FacilityActivityResponse,
  FacilityResponse,
  FacilityTimeResponse,
  FacilityTimesResponse,
} from './types/facilities';
import type {StatusReportResponse} from './types/status';
import type {
  UsersCreateRequest,
  UsersCreateResponse,
  UsersUpdateFirstNameRequest,
  UsersUpdateFirstNameResponse,
  UsersUpdateLastNameRequest,
  UsersUpdateLastNameResponse,
  UsersViewFullRecordResponse,
} from './types/users';

interface Token {
  token: string;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),
  tagTypes: ['User', 'BookingAvailability'],
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

    updateAuthUser: builder.mutation<void, UpdateUserRoleRequest & Token>({
      query: ({token, role, userId}) => ({
        url: `/auth/users/${userId}`,
        method: 'PATCH',
        headers: {Authorization: `Bearer ${token}`},
        body: {role},
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

    getUserRecord: builder.query<UsersViewFullRecordResponse, number>({
      query: userId => `/users/${userId}/viewFullRecord`,
      providesTags: ['User'],
    }),

    createUser: builder.mutation<UsersCreateResponse, UsersCreateRequest>({
      query: user => ({
        url: '/users/createUser',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['User'],
    }),

    updateUserFirstName: builder.mutation<
      UsersUpdateFirstNameResponse,
      UsersUpdateFirstNameRequest
    >({
      query: user => ({
        url: `/users/${user.id}/updateFirstName`,
        method: 'PUT',
        body: {firstName: user.firstName},
      }),
      invalidatesTags: ['User'],
    }),

    updateUserLastName: builder.mutation<
      UsersUpdateLastNameResponse,
      UsersUpdateLastNameRequest
    >({
      query: user => ({
        url: `/users/${user.id}/updateSurname`,
        method: 'PUT',
        body: {lastName: user.lastName},
      }),
      invalidatesTags: ['User'],
    }),

    getAvailableBookings: builder.query<
      BookingAvailabilityResponse,
      BookingAvailabilityRequest
    >({
      query: ({
        page = null,
        limit = null,
        start = null,
        end = null,
        activityId = null,
        facilityId = null,
      }) => {
        const search = new URLSearchParams();
        if (page) search.set('page', `${page}`);
        if (limit) search.set('limit', `${limit}`);
        if (start) search.set('start', `${start}`);
        if (end) search.set('end', `${end}`);
        if (activityId) search.set('activity', `${activityId}`);
        if (facilityId) search.set('facility', `${facilityId}`);

        return {
          url: `/booking/bookings/availability?${search.toString()}`,
        };
      },
      providesTags: ['BookingAvailability'],
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
  useUpdateAuthUserMutation,
  useGetFacilitiesQuery,
  useGetFacilityQuery,
  useGetFacilityActivitiesQuery,
  useGetFacilityActivityQuery,
  useGetFacilityTimesQuery,
  useGetFacilityTimeQuery,
  useGetUserRecordQuery,
  useCreateUserMutation,
  useUpdateUserFirstNameMutation,
  useUpdateUserLastNameMutation,
  useGetAvailableBookingsQuery,
} = api;
