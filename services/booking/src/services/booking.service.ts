type CreateBookingDTO = {};
type UpdateBookingDTO = {};

class BookingService {
  async create(resource: CreateBookingDTO) {}
  async get(limit: number, page: number) {}
  async getFromId(id: string) {}
  async updateFromId(id: string, resource: UpdateBookingDTO) {}
  async deleteFromId(id: string) {}
}

export default new BookingService();
