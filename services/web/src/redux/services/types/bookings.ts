// Generated by https://quicktype.io

export interface AvailableBooking {
  starts: string;
  duration: number;
  event: BookingEvent;
  capacity?: BookingCapacity;
}

export interface BookingCapacity {
  current: number;
  max: number;
}

export interface BookingEvent {
  id: number;
  name: string;
  activityId: number;
  day: number;
  time: number;
  duration: number;
  type: 'OPEN_USE' | 'TEAM_EVENT' | 'SESSION';
}

export interface BookingMetadata {
  count: number;
}

export interface BookingAvailabilityResponse {
  status: string;
  availableBookings: AvailableBooking[];
  metadata: BookingMetadata;
}

export interface BookingAvailabilityRequest {
  limit?: number | undefined;
  page?: number | undefined;
  start?: number | undefined;
  end?: number | undefined;
  activityId?: number | undefined;
  facilityId?: number | undefined;
}

export interface Booking {
  id: number;
  userId: number;
  eventId: number;
  starts: string;
  created: string;
  updated: string;
}

export interface BookingPagination {
  count: number;
  limit: number;
  page: number;
  pageCount: number;
}

export type GetBookingsRequest = {
  limit?: number;
  page?: number;
  userId?: number;
};

export type GetBookingsResponse = {
  status: string;
  bookings: Booking[];
  metadata: BookingPagination;
};
