import express from 'express';

class BookingController {
  async getBookings(req: express.Request, res: express.Response) {
    res.status(200);
  }

  async createBooking(req: express.Request, res: express.Response) {
    res.status(200);
  }

  async getBookingById(req: express.Request, res: express.Response) {
    res.status(200);
  }

  async updateBookingById(req: express.Request, res: express.Response) {
    res.status(200);
  }

  async deleteBookingById(req: express.Request, res: express.Response) {
    res.status(200);
  }
}

export default new BookingController();
