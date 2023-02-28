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
    logger.debug('Created instance of BookingService');
  }

  async create(bookingData: CreateBookingDTO) {
    logger.debug(`Create new booking, ${bookingData}`);
  }

  async get(limit: number, page: number) {
    logger.debug(`Get bookings, limit: ${limit}, page: ${page}`);
  }

  async getById(id: string) {
    logger.debug(`Get booking by id, ${id}`);
  }

  async updateById(id: string, bookingData: UpdateBookingDTO) {
    logger.debug(`Update booking by id, ${id}, ${bookingData}`);
  }

  async deleteById(id: string) {
    logger.debug(`Delete booking by id, ${id}`);
  }
}

export default new BookingService();
