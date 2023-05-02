import {Booking} from '@prisma/client';
import {EventDTO} from './event.dto';

export interface BookingDTO {
  id: number;
  userId: number;
  eventId: number;
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

export interface PossibleBookingDTO {
  duration: number;
  starts: string;
  event: EventDTO;
  capacity?: {
    current: number;
    max: number;
  };
}

export interface CreateBookingDTO {
  userId: number;
  eventId: number;
  starts: Date;
}

export interface UpdateBookingDTO {
  id: number;
  userId?: number;
  eventId?: number;
  starts?: Date;
}

export interface BookBookingDTO {
  event: number;
  starts: number;
  user: number;
}
