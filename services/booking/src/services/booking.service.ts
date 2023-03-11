import bookingDao from '@/dao/booking.dao';
import {CreateBookingDTO, UpdateBookingDTO} from '@/dto/booking.dto';
import logger from '@/lib/logger';

/**
 * The Booking Service performs any required business logic before updating the
 * database
 *
 * @class BookingService
 */
class BookingService {
  constructor() {
    logger.debug('Created instance of Booking Service');
  }

  /**
   * Create a new booking
   *
   * @memberof BookingService
   */
  async create(bookingData: CreateBookingDTO) {
    logger.debug(`Create new booking, ${bookingData}`);

    return await bookingDao.addBooking(bookingData);
  }

  /**
   * Get multiple bookings which are paginatable with page and limit params
   *
   * @memberof BookingService
   */
  async get(limit?: number, page?: number) {
    logger.debug(`Get bookings, limit: ${limit}, page: ${page}`);

    return await bookingDao.getBookings(limit, page);
  }

  /**
   * Get paginatable list of bookings for the user
   *
   * @memberof BookingService
   */
  async getUserBookings(user: number, limit?: number, page?: number) {
    logger.debug(`Get user ${user} bookings, limit: ${limit}, page: ${page}`);
    return await bookingDao.getBookingsForUser(user, limit, page);
  }

  /**
   * Get a single booking by id
   *
   * @memberof BookingService
   */
  async getById(id: number) {
    logger.debug(`Get booking by id, ${id}`);

    return await bookingDao.getBooking(id);
  }

  /**
   * Update a booking
   *
   * @memberof BookingService
   */
  async update(bookingData: UpdateBookingDTO) {
    logger.debug(`Update booking by id, ${bookingData.id}, ${bookingData}`);

    return await bookingDao.editBooking(bookingData);
  }

  /**
   * Delete a booking by id
   *
   * @memberof BookingService
   */
  async deleteById(id: number) {
    logger.debug(`Delete booking by id, ${id}`);

    return await bookingDao.deleteBooking(id);
  }

  /**
   * Get a list of available bookings given the current filters. All of the
   * filters are optional which means that there are a number of fallback
   * filters to use if unspecified. They are:
   *
   * - start: 00:00 of the current day
   * - end: 23:59 of the current day
   * - facility: all facilities searched
   * - activity: all activities searched
   *
   * pagination (the limits will likely be changed to enforce the use of pagination)
   * - limit: no limit (all returned)
   * - page: will default to 1
   *
   * @memberof BookingService
   */
  async getAvailableBookings(
    start?: number,
    end?: number,
    facility?: number,
    activity?: number,
    limit?: number,
    page?: number
  ) {
    if (!start) start = new Date().setHours(0, 0, 0);
    if (!end) end = new Date().setHours(23, 59, 59);

    // check if available events has been generated for that time range
  }
}

export default new BookingService();
