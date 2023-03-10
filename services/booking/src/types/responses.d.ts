import {BookingDTO} from '@/dto/booking.dto';
import {Pagination} from '.';

type PaginatedBookings = {
  bookings: BookingDTO[];
} & Pagination;
