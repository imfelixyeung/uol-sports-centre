import {CreateBookingDTO, UpdateBookingDTO} from '../dto/booking.dto';
import logger from '../lib/logger';
import prisma from '../lib/prisma';

/**
 * The Booking DAO (Data Access Object) is used to abstract the underlying
 * database accesses from the business logic
 *
 * @class BookingDAO
 */
class BookingDAO {
  constructor() {
    logger.debug('Created instance of Booking DAO');
  }

  async addBooking(bookingData: CreateBookingDTO) {
    logger.debug(`Adding booking to database, ${bookingData}`);
  }

  async editBooking(bookingId: string, bookingData: UpdateBookingDTO) {
    logger.debug(`Editing booking in database, ${bookingId}, ${bookingData}`);
  }

  async deleteBooking(bookingId: string) {
    logger.debug(`Deleting booking in database, ${bookingId}`);
  }

  async getBooking(bookingId: string) {
    logger.debug(`Getting booking from database, ${bookingId}`);
  }

  async getBookings(limit?: number, page?: number) {
    logger.debug(
      `Getting bookings from database, limit: ${limit}, page: ${page}`
    );

    // using offset based pagination for simplicity here
    const bookings = await prisma.booking.findMany({
      skip: page && limit ? page * limit : undefined,
      take: limit,
    });

    return bookings;
  }
}

export default new BookingDAO();
