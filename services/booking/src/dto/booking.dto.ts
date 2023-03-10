import {Booking} from '@prisma/client';

export interface BookingDTO {
  id: number;
  userId: number;
  facilityId: number;
  transactionId: number;
  duration: number;
  starts: string;
  created: string;
  updated: string;
}

export const bookingToDTO = (booking: Booking): BookingDTO => {
  return {
    ...booking,
    starts: booking.starts.toISOString(),
    created: booking.created.toISOString(),
    updated: booking.updated.toISOString(),
  };
};

export interface CreateBookingDTO {
  userId: number;
  facilityId: number;
  transactionId: number;
  duration: number;
  starts: Date;
}

export interface UpdateBookingDTO {
  id: number;
  userId?: number;
  facilityId?: number;
  transactionId?: number;
  duration?: number;
  starts?: Date;
}
