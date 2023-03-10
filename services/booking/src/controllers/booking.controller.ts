import express from 'express';
import {z} from 'zod';
import {CreateBookingDTO, UpdateBookingDTO} from '@/dto/booking.dto';
import logger from '@/lib/logger';
import bookingService from '@/services/booking.service';

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
      limit: z
        .string()
        .transform(limit => parseInt(limit))
        .refine(limit => !Number.isNaN(limit), {
          message: 'Non-numeric limit parameter supplied',
        })
        .optional(),
      page: z
        .string()
        .transform(page => parseInt(page))
        .refine(page => !Number.isNaN(page), {
          message: 'Non-numeric page parameter supplied',
        })
        .optional(),
      user: z
        .string()
        .transform(uid => parseInt(uid))
        .refine(uid => !Number.isNaN(uid), {
          message: 'Non-numeric user id supplied',
        })
        .optional(),
    });

    // ensure the query params abide by that schema
    const query = querySchema.safeParse(req.query);
    if (!query.success)
      return res.status(400).json({
        status: 'error',
        message: 'malformed query parameters',
        error: query.error,
      });

    let bookings;
    if (query.data.user) {
      bookings = await bookingService.getUserBookings(
        query.data.user,
        query.data.limit,
        query.data.page
      );
    } else {
      bookings = await bookingService.get(query.data.limit, query.data.page);
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
    const newBooking = await bookingService.create(bookingData);

    // check has created
    if (newBooking === null)
      return res.status(500).send({
        status: 'error',
        message: 'Unable to create booking',
      });

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
      id: z
        .string()
        .transform(id => parseInt(id))
        .refine(id => !Number.isNaN(id), {
          message: 'Non-number id supplied',
        }),
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
    const booking = await bookingService.getById(params.data.id);
    if (booking === null) {
      // if it is null, it was not found in the database
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found',
      });
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
      id: z
        .string()
        .transform(id => parseInt(id))
        .refine(id => !Number.isNaN(id), {
          message: 'Non-number id supplied',
        }),
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
    const updatedBooking = await bookingService.update(bookingData);

    // check has created
    if (updatedBooking === null)
      return res.status(500).send({
        status: 'error',
        message: 'Unable to create booking',
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
      id: z
        .string()
        .transform(id => parseInt(id))
        .refine(id => !Number.isNaN(id), {
          message: 'Non-number id supplied',
        }),
    });

    // ensure the request params abide by that schema
    const params = deleteBookingParamsSchema.safeParse(req.params);
    if (!params.success)
      return res.status(400).json({
        status: 'error',
        message: 'malformed parameters',
        error: params.error,
      });

    return res.status(200).send({
      status: 'OK',
      booking: await bookingService.deleteById(params.data.id),
    });
  }
}

export default new BookingController();
