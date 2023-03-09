import {CreateBookingDTO, UpdateBookingDTO} from '@/dto/booking.dto';
import logger from '@/lib/logger';
import prisma from '@/lib/prisma';

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

  /**
   * Adds a booking record to the database
   *
   * @memberof BookingDAO
   */
  async addBooking(bookingData: CreateBookingDTO) {
    logger.debug(`Adding booking to database, ${bookingData}`);

    const booking = await prisma.booking.create({
      data: {...bookingData, created: new Date(), updated: new Date()},
    });

    return booking;
  }

  /**
   * Edits a booking record in the database
   *
   * @memberof BookingDAO
   */
  async editBooking(bookingData: UpdateBookingDTO) {
    logger.debug(
      `Editing booking in database, ${bookingData.id}, ${bookingData}`
    );

    // split id and the rest of the data
    const {id, ...updateData} = bookingData;

    const booking = await prisma.booking.update({
      where: {
        id: id,
      },
      data: updateData,
    });

    return booking;
  }

  /**
   * Deletes a booking record in the database
   *
   * @memberof BookingDAO
   */
  async deleteBooking(bookingId: number) {
    logger.debug(`Deleting booking in database, ${bookingId}`);

    const booking = await prisma.booking.delete({
      where: {
        id: bookingId,
      },
    });

    return booking;
  }

  /**
   * Gets a specific booking from the database by id
   *
   * @memberof BookingDAO
   */
  async getBooking(bookingId: number) {
    logger.debug(`Getting booking from database, ${bookingId}`);

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

    return booking;
  }

  /**
   * Gets a list of bookings from the database with optional limit and page
   * pagination options
   *
   * @memberof BookingDAO
   */
  async getBookings(limit?: number, page?: number) {
    logger.debug(
      `Getting bookings from database, limit: ${limit}, page: ${page}`
    );

    // using offset based pagination for simplicity here
    const bookings = await prisma.booking.findMany({
      skip: page && limit && page > 1 ? (page - 1) * limit : undefined,
      take: limit,
    });

    return bookings;
  }
}

export default new BookingDAO();
