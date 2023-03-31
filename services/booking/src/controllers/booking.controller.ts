import express from 'express';
import {z} from 'zod';
import {CreateBookingDTO, UpdateBookingDTO} from '@/dto/booking.dto';
import logger from '@/lib/logger';
import bookingService from '@/services/booking.service';
import {PaginatedBookings} from '@/types/responses';
import paginationSchema from '@/schema/pagination';
import {id, timestamp} from '@/schema';
import NotFoundError from '@/errors/notFound';
import {Request} from 'express-jwt';
import {UserRole} from '@/middleware/auth';

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
  async getBookings(req: Request, res: express.Response) {
    logger.debug('Received getBookings request');

    // create a schema, outlining what we expect from params
    const querySchema = z.object({
      ...paginationSchema,
      start: timestamp.optional(),
      end: timestamp.optional(),
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
    if (query.data.user !== undefined) {
      const filter = {...query.data, user: query.data.user};

      // if user is admin or trying to get their own bookings, get the bookings
      if (
        [UserRole.ADMIN, UserRole.EMPLOYEE].includes(req.auth?.user.role) ||
        req.auth?.user.id === query.data.user
      ) {
        bookings = await bookingService.getUserBookings(filter).catch(err => {
          logger.error(
            `Error getting bookings from user ${query.data.user}: ${err}`
          );
          return new Error(err);
        });
      } else {
        return res.status(403).json({
          status: 'error',
          error: 'You are not allowed to view bookings for other users',
        });
      }
    } else {
      // is getting all bookings

      // if user is not admin, return 403
      if (![UserRole.ADMIN, UserRole.EMPLOYEE].includes(req.auth?.user.role)) {
        logger.debug('User is not admin or employee');
        return res.status(403).json({
          status: 'error',
          error: 'You are not allowed to view all bookings',
        });
      }

      bookings = await bookingService.get(query.data).catch(err => {
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
  async createBooking(req: Request, res: express.Response) {
    logger.debug('Received createBooking request');

    // get post body information
    const createBookingBodySchema = z.object({
      userId: z.number(),
      eventId: z.number(),
      starts: z.string().transform(time => new Date(time)),
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
  async getBookingById(req: Request, res: express.Response) {
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

    // if user is not admin, or the user is not the owner of the booking, return 403
    if (
      ![UserRole.ADMIN, UserRole.EMPLOYEE].includes(req.auth?.user.role) &&
      req.auth?.user.id !== booking.userId
    ) {
      logger.debug('User is not admin/employee or owner of booking');
      return res.status(403).json({
        status: 'error',
        error: 'You are not allowed to view this booking',
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
      eventId: z.number().optional(),
      starts: z
        .string()
        .transform(time => new Date(time))
        .optional(),
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
    if (updatedBooking instanceof Error) {
      if (updatedBooking instanceof NotFoundError) {
        return res.status(404).json({
          status: 'error',
          error: 'Booking not found',
        });
      } else {
        return res.status(500).send({
          status: 'error',
          error: 'Unable to update booking',
        });
      }
    }

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
  async deleteBookingById(req: Request, res: express.Response) {
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

    // try find the booking to get the owner of the booking
    const testBooking = await bookingService
      .getById(params.data.id)
      .catch(err => {
        logger.error(`Unable to get booking ${params.data.id}: ${err}`);
        return new Error(err);
      });

    if (testBooking instanceof Error) {
      if (testBooking instanceof NotFoundError) {
        return res.status(404).json({
          status: 'error',
          error: 'Booking not found',
        });
      } else {
        return res.status(500).json({
          status: 'error',
          error: testBooking,
        });
      }
    }

    // if user is not admin, or the user is not the owner of the booking, return 403
    if (
      ![UserRole.ADMIN, UserRole.EMPLOYEE].includes(req.auth?.user.role) &&
      req.auth?.user.id !== testBooking.userId
    ) {
      logger.debug('User is not admin/employee or owner of booking');
      return res.status(403).json({
        status: 'error',
        error: 'You are not allowed to delete this booking',
      });
    }

    // delete the booking
    const booking = await bookingService
      .deleteById(params.data.id)
      .catch(err => {
        logger.error(`Error deleting booking ${params.data.id}: ${err}`);
        return new Error(err);
      });

    if (booking instanceof Error) {
      if (booking instanceof NotFoundError) {
        return res.status(404).json({
          status: 'error',
          error: 'Booking not found',
        });
      } else {
        return res.status(500).send({
          status: 'error',
          error: booking,
        });
      }
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
    const availableBookingQuerySchema = z
      .object({
        ...paginationSchema,
        start: timestamp.default(`${new Date().setHours(0, 0, 0, 0)}`),
        end: timestamp.default(`${new Date().setHours(23, 59, 59, 999)}`),
        facility: id('facility id').optional(),
        activity: id('activity id').optional(),
      })
      .superRefine(({start, end}, ctx) => {
        if (start === end) {
          ctx.addIssue({
            code: 'custom',
            message: `The start and end filters cannot match: ${start} ${end}`,
          });
        }
      });

    const query = availableBookingQuerySchema.safeParse(req.query);
    if (!query.success)
      return res.status(400).json({
        status: 'error',
        message: 'malformed parameters',
        error: query.error,
      });

    const availableBookings = await bookingService
      .getAvailableBookings(query.data)
      .catch(err => {
        logger.error(`Error getting available bookings: ${err}`);
        return new Error(err);
      });

    if (availableBookings instanceof Error) {
      return res.status(500).send({
        status: 'error',
        error: availableBookings.message,
      });
    }

    return res.status(200).send({
      status: 'OK',
      availableBookings,
      metadata: {
        count: availableBookings.length,
      },
    });
  }

  /**
   * The endpoint called when the user wants to book a booking
   *
   * @memberof BookingController
   */
  async bookBooking(req: Request, res: express.Response) {
    const bookBodySchema = z.object({
      // accept start date as iso string zod validator
      starts: z.string().transform(t => new Date(t).getTime()),
      event: id('event id'),
      user: id('user id'),
    });

    const query = bookBodySchema.safeParse(req.body);
    if (!query.success) {
      console.log({
        status: 'error',
        message: 'malformed parameters',
        error: query.error,
      });
      return res.status(400).json({
        status: 'error',
        message: 'malformed parameters',
        error: query.error,
      });
    }

    // if the user is not booking for themselves and they are not an admin, return an error
    if (
      ![UserRole.ADMIN, UserRole.EMPLOYEE].includes(req.auth?.user.role) &&
      req.auth?.user.id !== query.data.user
    ) {
      return res.status(403).send({
        status: 'error',
        error: 'You do not have permission to book for this user',
      });
    }

    const booking = await bookingService.book(query.data);

    if (booking instanceof Error) {
      if (booking instanceof NotFoundError) {
        return res.status(404).json({
          status: 'error',
          error: 'Booking not found',
        });
      } else {
        return res.status(500).send({
          status: 'error',
          error: booking.message,
        });
      }
    }

    return res.status(200).send({
      status: 'OK',
      booking,
    });
  }
}

export default new BookingController();
