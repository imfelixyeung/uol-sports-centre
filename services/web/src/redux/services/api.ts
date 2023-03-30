import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import dayjs from 'dayjs';
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
  BookBookingRequest,
  BookBookingResponse,
  BookingAvailabilityRequest,
  BookingAvailabilityResponse,
  GetBookingEventsRequest,
  GetBookingEventsResponse,
  GetBookingRequest,
  GetBookingResponse,
  GetBookingsRequest,
  GetBookingsResponse,
} from './types/bookings';
import type {
  CreateFacilityActivityRequest,
  CreateFacilityActivityResponse,
  CreateFacilityRequest,
  CreateFacilityResponse,
  FacilitiesResponse,
  FacilityActivitiesResponse,
  FacilityActivityResponse,
  FacilityResponse,
  FacilityTimeRequest,
  FacilityTimeResponse,
  FacilityTimesResponse,
  UpdateFacilityActivityRequest,
  UpdateFacilityActivityResponse,
  UpdateFacilityRequest,
  UpdateFacilityResponse,
} from './types/facilities';
import type {
  GetCustomerPortalRequest,
  GetCustomerPortalResponse,
} from './types/payments';
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
  tagTypes: [
    'User',
    'Booking',
    'BookingEvent',
    'BookingAvailability',
    'Facility',
    'FacilityActivity',
    'FacilityTime',
  ],
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
      providesTags: ['Facility'],
    }),

    getFacility: builder.query<FacilityResponse, number>({
      query: facilityId => `/facilities/facilities/${facilityId}`,
      providesTags: ['Facility'],
    }),

    createFacility: builder.mutation<
      CreateFacilityResponse,
      CreateFacilityRequest & Token
    >({
      query: ({token, ...facility}) => ({
        url: '/facilities/facilities/',
        body: facility,
        method: 'POST',
        headers: {Authorization: `Bearer ${token}`},
      }),
      invalidatesTags: ['Facility'],
    }),

    updateFacility: builder.mutation<
      UpdateFacilityResponse,
      UpdateFacilityRequest & Token
    >({
      query: ({token, id, ...facility}) => ({
        url: `/facilities/facilities/${id}`,
        body: facility,
        method: 'PUT',
        headers: {Authorization: `Bearer ${token}`},
      }),
      invalidatesTags: ['Facility'],
    }),

    getFacilityTimes: builder.query<FacilityTimesResponse, void>({
      query: () => '/facilities/times/',
      providesTags: ['FacilityTime'],
    }),

    getFacilityTime: builder.query<FacilityTimeResponse, number>({
      query: timeId => `/facilities/times/${timeId}`,
      providesTags: ['FacilityTime'],
    }),

    updateFacilityTime: builder.mutation<void, FacilityTimeRequest & Token>({
      query: ({token, id, ...rest}) => ({
        url: `/facilities/times/${id}`,
        body: rest,
        method: 'PUT',
        headers: {Authorization: `Bearer ${token}`},
      }),
      invalidatesTags: ['FacilityTime'],
    }),

    getFacilityActivities: builder.query<FacilityActivitiesResponse, void>({
      query: () => '/facilities/activities/',
      providesTags: ['FacilityActivity'],
    }),

    getFacilityActivity: builder.query<FacilityActivityResponse, number>({
      query: activityId => `/facilities/activities/${activityId}`,
      providesTags: ['FacilityActivity'],
    }),

    updateFacilityActivity: builder.mutation<
      UpdateFacilityActivityResponse,
      UpdateFacilityActivityRequest & Token
    >({
      query: ({token, id, ...activity}) => ({
        url: `/facilities/activities/${id}`,
        body: activity,
        method: 'PUT',
        headers: {Authorization: `Bearer ${token}`},
      }),
      invalidatesTags: ['FacilityActivity'],
    }),

    createFacilityActivity: builder.mutation<
      CreateFacilityActivityResponse,
      CreateFacilityActivityRequest & Token
    >({
      query: ({token, ...activity}) => ({
        url: '/facilities/activities/',
        body: activity,
        method: 'POST',
        headers: {Authorization: `Bearer ${token}`},
      }),
      invalidatesTags: ['FacilityActivity'],
    }),

    getUserRecord: builder.query<UsersViewFullRecordResponse, number>({
      query: userId => `/users/${userId}/viewFullRecord`,
      providesTags: ['User'],
    }),

    createUser: builder.mutation<
      UsersCreateResponse,
      UsersCreateRequest & Token
    >({
      query: ({token, ...user}) => ({
        url: '/users/createUser',
        method: 'POST',
        body: user,
        headers: {Authorization: `Bearer ${token}`},
      }),
      invalidatesTags: ['User'],
    }),

    updateUserFirstName: builder.mutation<
      UsersUpdateFirstNameResponse,
      UsersUpdateFirstNameRequest & Token
    >({
      query: ({token, ...user}) => ({
        url: `/users/${user.id}/updateFirstName`,
        method: 'PUT',
        body: {firstName: user.firstName},
        headers: {Authorization: `Bearer ${token}`},
      }),
      invalidatesTags: ['User'],
    }),

    updateUserLastName: builder.mutation<
      UsersUpdateLastNameResponse,
      UsersUpdateLastNameRequest & Token
    >({
      query: ({token, ...user}) => ({
        url: `/users/${user.id}/updateSurname`,
        method: 'PUT',
        body: {lastName: user.lastName},
        headers: {Authorization: `Bearer ${token}`},
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
        if (page !== null) search.set('page', `${page}`);
        if (limit !== null) search.set('limit', `${limit}`);
        if (start !== null) search.set('start', `${start}`);
        if (end !== null) search.set('end', `${end}`);
        if (activityId !== null) search.set('activity', `${activityId}`);
        if (facilityId !== null) search.set('facility', `${facilityId}`);

        return {
          url: `/booking/bookings/availability?${search.toString()}`,
        };
      },
      providesTags: ['BookingAvailability', 'BookingEvent'],
    }),

    bookBooking: builder.mutation<
      BookBookingResponse,
      BookBookingRequest & Token
    >({
      query: ({event, starts, token, user}) => ({
        url: '/booking/bookings/book',
        method: 'POST',
        headers: {Authorization: `Bearer ${token}`},
        body: {event, starts, user},
      }),
      invalidatesTags: ['Booking'],
    }),

    getBookings: builder.query<GetBookingsResponse, GetBookingsRequest & Token>(
      {
        query: ({limit = null, page = null, userId: user = null, token}) => {
          const search = new URLSearchParams();
          if (page !== null) search.set('page', `${page}`);
          if (limit !== null) search.set('limit', `${limit}`);
          if (user !== null) search.set('user', `${user}`);

          return {
            url: `/booking/bookings?${search.toString()}`,
            headers: {Authorization: `Bearer ${token}`},
          };
        },
        providesTags: ['Booking'],
      }
    ),

    getBooking: builder.query<GetBookingResponse, GetBookingRequest & Token>({
      query: ({bookingId, token}) => ({
        url: `/booking/bookings/${bookingId}`,
        headers: {Authorization: `Bearer ${token}`},
      }),
      providesTags: ['Booking'],
    }),

    getBookingEvents: builder.query<
      GetBookingEventsResponse,
      GetBookingEventsRequest
    >({
      query: () => {
        const start = dayjs();
        const end = start.add(8, 'days');

        const search = new URLSearchParams();
        search.set('start', `${start.valueOf()}`);
        search.set('end', `${end.valueOf()}`);

        return {
          url: `/booking/events?${search.toString()}`,
        };
      },
      providesTags: ['BookingEvent'],
    }),

    getCustomerPortal: builder.query<
      GetCustomerPortalResponse,
      GetCustomerPortalRequest & Token
    >({
      query: ({userId, token}) => ({
        url: `/payments/customer-portal/${userId}`,
        headers: {Authorization: `Bearer ${token}`},
      }),
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
  useCreateFacilityMutation,
  useUpdateFacilityMutation,
  useGetFacilityActivitiesQuery,
  useGetFacilityActivityQuery,
  useCreateFacilityActivityMutation,
  useUpdateFacilityActivityMutation,
  useGetFacilityTimesQuery,
  useGetFacilityTimeQuery,
  useUpdateFacilityTimeMutation,
  useGetUserRecordQuery,
  useCreateUserMutation,
  useUpdateUserFirstNameMutation,
  useUpdateUserLastNameMutation,
  useGetAvailableBookingsQuery,
  useBookBookingMutation,
  useGetBookingsQuery,
  useGetBookingQuery,
  useGetBookingEventsQuery,
  useGetCustomerPortalQuery,
} = api;
