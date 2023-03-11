import express from 'express';
import {z} from 'zod';
import {CreateBookingDTO, UpdateBookingDTO} from '@/dto/booking.dto';
import logger from '@/lib/logger';
import bookingService from '@/services/booking.service';
import {PaginatedBookings} from '@/types/responses';
import paginationSchema from '@/schema/pagination';
import {id, timestamp} from '@/schema';
import NotFoundError from '@/errors/notFound';

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

  /**
   * Get all bookings
   * Accepts pagination query attributes `limit` and `page`
   *
   * @memberof BookingController
   */
  async getBookings(req: express.Request, res: express.Response) {
    logger.debug('Received getBookings request');

    // create a schema, outlining what we expect from params
    const querySchema = z.object({
      ...paginationSchema,
      user: id('user id').optional(),
    });

    // ensure the query params abide by that schema
    const query = querySchema.safeParse(req.query);
    if (!query.success)
      return res.status(400).json({
        status: 'error',
        message: 'malformed query parameters',
        error: query.error,
      });

    let bookings: PaginatedBookings | Error;
    if (query.data.user) {
      bookings = await bookingService
        .getUserBookings(query.data.user, query.data.limit, query.data.page)
        .catch(err => {
          logger.error(
            `Error getting bookings from user ${query.data.user}: ${err}`
          );
          return new Error(err);
        });
    } else {
      bookings = await bookingService
        .get(query.data.limit, query.data.page)
        .catch(err => {
          logger.error(`Error getting bookings: ${err}`);
          return new Error(err);
        });
    }

    if (bookings instanceof Error) {
      return res.status(500).json({
        status: 'error',
        error: bookings,
      });
    }

    return res.status(200).send({
      status: 'OK',
      ...bookings,
    });
  }

  /**
   * Creates a new booking
   *
   * @memberof BookingController
   */
  async createBooking(req: express.Request, res: express.Response) {
    logger.debug('Received createBooking request');

    // get post body information
    const createBookingBodySchema = z.object({
      userId: z.number(),
      facilityId: z.number(),
      activityId: z.number(),
      transactionId: z.number(),
      starts: z.string().transform(time => new Date(time)),
      duration: z.number(),
    });

    // ensure the request params abide by that schema
    const body = createBookingBodySchema.safeParse(req.body);
    if (!body.success)
      return res.status(400).json({
        status: 'error',
        message: 'malformed parameters',
        error: body.error,
      });

    // create the new booking
    const bookingData: CreateBookingDTO = body.data;
    const newBooking = await bookingService.create(bookingData).catch(err => {
      logger.error(`Unable to create booking: ${err}`);
      return new Error(err);
    });

    if (newBooking instanceof Error) {
      return res.status(500).send({
        status: 'error',
        error: 'Unable to create booking',
      });
    }
    // after passing all the above checks, the booking should be okay
    return res.status(200).send({
      status: 'OK',
      booking: newBooking,
    });
  }

  /**
   * Gets a specific booking by id
   *
   * @memberof BookingController
   */
  async getBookingById(req: express.Request, res: express.Response) {
    logger.debug('Received getBookingById request');

    // create a schema, outlining what we expect from params
    const paramSchema = z.object({
      id: id('booking id'),
    });

    // ensure the request params abide by that schema
    const params = paramSchema.safeParse(req.params);
    if (!params.success)
      return res.status(400).json({
        status: 'error',
        message: 'malformed parameters',
        error: params.error,
      });

    // try find the booking
    const booking = await bookingService.getById(params.data.id).catch(err => {
      logger.error(`Unable to get booking ${params.data.id}: ${err}`);
      return new Error(err);
    });

    if (booking instanceof Error) {
      if (booking instanceof NotFoundError) {
        // if it is null, it was not found in the database
        return res.status(404).json({
          status: 'error',
          error: 'Booking not found',
        });
      } else {
        return res.status(500).json({
          status: 'error',
          error: booking,
        });
      }
    }

    // after passing all the above checks, the booking should be okay
    return res.status(200).send({
      status: 'OK',
      booking: booking,
    });
  }

  /**
   * Updates a specific booking
   *
   * @memberof BookingController
   */
  async updateBookingById(req: express.Request, res: express.Response) {
    logger.debug('Received updateBookingById request');

    // get post body information
    const updateBookingBodySchema = z.object({
      userId: z.number().optional(),
      facilityId: z.number().optional(),
      transactionId: z.number().optional(),
      starts: z
        .string()
        .transform(time => new Date(time))
        .optional(),
      duration: z.number().optional(),
    });
    const updateBookingParamsSchema = z.object({
      id: id('booking id'),
    });

    // ensure the request params abide by that schema
    const body = updateBookingBodySchema.safeParse(req.body);
    const params = updateBookingParamsSchema.safeParse(req.params);
    if (!body.success)
      return res.status(400).json({
        status: 'error',
        message: 'malformed body',
        error: body.error,
      });
    if (!params.success)
      return res.status(400).json({
        status: 'error',
        message: 'malformed parameters',
        error: params.error,
      });

    // create the new booking
    const bookingData: UpdateBookingDTO = {id: params.data.id, ...body.data};
    const updatedBooking = await bookingService
      .update(bookingData)
      .catch(err => {
        logger.error(`Error updating booking ${params.data.id}: ${err}`);
        return new Error(err);
      });

    // check has created
    if (updatedBooking instanceof Error)
      return res.status(500).send({
        status: 'error',
        error: 'Unable to update booking',
      });

    // after passing all the above checks, the booking should be okay
    return res.status(200).send({
      status: 'OK',
      booking: updatedBooking,
    });
  }

  /**
   * Deletes a booking
   *
   * @memberof BookingController
   */
  async deleteBookingById(req: express.Request, res: express.Response) {
    logger.debug('Received deleteBookingById request');

    const deleteBookingParamsSchema = z.object({
      id: id('booking id'),
    });

    // ensure the request params abide by that schema
    const params = deleteBookingParamsSchema.safeParse(req.params);
    if (!params.success)
      return res.status(400).json({
        status: 'error',
        message: 'malformed parameters',
        error: params.error,
      });

    const booking = await bookingService
      .deleteById(params.data.id)
      .catch(err => {
        logger.error(`Error deleting booking ${params.data.id}: ${err}`);
        return new Error(err);
      });

    if (booking instanceof Error) {
      return res.status(500).send({
        status: 'error',
        error: booking,
      });
    }

    return res.status(200).send({
      status: 'OK',
      booking,
    });
  }

  /**
   * Get available booking slots based on filter variables
   *
   * @memberof BookingController
   */
  async getAvailableBookings(req: express.Request, res: express.Response) {
    const availableBookingParamsSchema = z.object({
      ...paginationSchema,
      start: timestamp.optional(),
      end: timestamp.optional(),
      facility: id('facility id').optional(),
      activity: id('activity id').optional(),
    });

    const params = availableBookingParamsSchema.safeParse(req.params);
    if (!params.success)
      return res.status(400).json({
        status: 'error',
        message: 'malformed parameters',
        error: params.error,
      });

    const availableBookings = await bookingService
      .getAvailableBookings()
      .catch(err => {
        logger.error(`Error getting available bookings: ${err}`);
        return new Error(err);
      });

    if (availableBookings instanceof Error) {
      return res.status(500).send({
        status: 'error',
        error: availableBookings,
      });
    }

    return res.status(200).send({
      status: 'OK',
      availableBookings,
    });
  }
}

export default new BookingController();
