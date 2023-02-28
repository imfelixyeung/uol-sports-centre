import express from 'express';
import logger from '../lib/logger';
import bookingService from '../services/booking.service';

/**
 * The Booking Controller handles the incomming network requests and validates
 * the received data before passing it on down to the BookingService for the
 * respective handler
 *
 * @class BookingController
 */
class BookingController {
  constructor() {
    logger.debug('Created instance of Booking Controller');
  }

  async getBookings(req: express.Request, res: express.Response) {
    logger.debug('Received getBookings request');

    res.status(200).send({status: 'OK', bookings: await bookingService.get()});
  }

  async createBooking(req: express.Request, res: express.Response) {
    logger.debug('Received createBooking request');

    res.status(200).send({status: 'OK'});
  }

  async getBookingById(req: express.Request, res: express.Response) {
    logger.debug('Received getBookingById request');

    res.status(200).send({status: 'OK'});
  }

  async updateBookingById(req: express.Request, res: express.Response) {
    logger.debug('Received updateBookingById request');

    res.status(200).send({status: 'OK'});
  }

  async deleteBookingById(req: express.Request, res: express.Response) {
    logger.debug('Received deleteBookingById request');

    res.status(200).send({status: 'OK'});
  }
}

export default new BookingController();
