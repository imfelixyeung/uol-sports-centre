import express from 'express';
import {z} from 'zod';
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

    // create a schema, outlining what we expect from params
    const paramSchema = z.object({
      id: z.string().transform(id => parseInt(id)),
    });

    // ensure the request params abide by that schema
    const params = paramSchema.safeParse(req.params);
    if (!params.success)
      return res.status(400).json({
        status: 'error',
        message: 'malformed parameters',
        error: params.error,
      });

    if (Number.isNaN(params.data.id))
      return res.status(400).json({
        status: 'error',
        message: 'Non-number id supplied',
        error: `parsed ${req.params.id} as ${params.data.id}`,
      });

    return res.status(200).send({
      status: 'OK',
      booking: await bookingService.getById(params.data.id),
    });
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
