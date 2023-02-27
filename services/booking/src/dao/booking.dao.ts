import {CreateBookingDTO, UpdateBookingDTO} from '../dto/booking.dto';

class BookingDAO {
  constructor() {
    console.debug('Created instance of Booking DAO');
  }

  async addBooking(bookingData: CreateBookingDTO) {}
  async editBooking(bookingId: string, bookingData: UpdateBookingDTO) {}
  async deleteBooking(bookingId: string) {}
  async getBookings(limit: number, page: number) {}
}

export default new BookingDAO();
