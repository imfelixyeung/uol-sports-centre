import bookingDao from '../dao/booking.dao';
import {CreateBookingDTO, UpdateBookingDTO} from '../dto/booking.dto';
import logger from '../lib/logger';

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

  async create(bookingData: CreateBookingDTO) {
    logger.debug(`Create new booking, ${bookingData}`);
  }

  async get(limit?: number, page?: number) {
    logger.debug(`Get bookings, limit: ${limit}, page: ${page}`);

    return await bookingDao.getBookings(limit, page);
  }

  async getById(id: number) {
    logger.debug(`Get booking by id, ${id}`);

    return await bookingDao.getBooking(id);
  }

  async updateById(id: string, bookingData: UpdateBookingDTO) {
    logger.debug(`Update booking by id, ${id}, ${bookingData}`);
  }

  async deleteById(id: string) {
    logger.debug(`Delete booking by id, ${id}`);
  }
}

export default new BookingService();
