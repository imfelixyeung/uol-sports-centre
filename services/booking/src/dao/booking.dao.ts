import {
  bookingToDTO,
  CreateBookingDTO,
  UpdateBookingDTO,
} from '@/dto/booking.dto';
import NotFoundError from '@/errors/notFound';
import logger from '@/lib/logger';
import prisma from '@/lib/prisma';
import {BookingsFilter} from '@/types/bookings';
import {PaginatedBookings} from '@/types/responses';
import {Booking, Prisma} from '@prisma/client';

/**
 * The Booking DAO (Data Access Object) is used to abstract the underlying
 * database accesses from the business logic
 *
 * @class BookingDAO
 */
class BookingDAO {
  constructor() {
    logger.debug('Created instance of Booking DAO');
  }

  /**
   * Adds a booking record to the database
   *
   * @memberof BookingDAO
   */
  async addBooking(bookingData: CreateBookingDTO): Promise<Booking | Error> {
    logger.debug(`Adding booking to database, ${JSON.stringify(bookingData)}`);

    const booking = await prisma.booking
      .create({
        data: {...bookingData, created: new Date(), updated: new Date()},
      })
      .catch(err => {
        logger.error(`Error creating booking ${err}`);
        return new Error(err);
      });

    return booking;
  }

  /**
   * Edits a booking record in the database
   *
   * @memberof BookingDAO
   */
  async editBooking(bookingData: UpdateBookingDTO): Promise<Booking | Error> {
    logger.debug(
      `Editing booking in database, ${bookingData.id}, ${bookingData}`
    );

    // split id and the rest of the data
    const {id, ...updateData} = bookingData;

    const booking = await prisma.booking
      .update({
        where: {
          id: id,
        },
        data: updateData,
      })
      .catch(err => {
        logger.error(`Error updating booking booking ${err}`);
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2025') {
            return new NotFoundError(`Booking ${id} not found`);
          }
        }
        return new Error(err);
      });

    return booking;
  }

  /**
   * Deletes a booking record in the database
   *
   * @memberof BookingDAO
   */
  async deleteBooking(bookingId: number): Promise<Booking | Error> {
    logger.debug(`Deleting booking in database, ${bookingId}`);

    const booking = await prisma.booking
      .delete({
        where: {
          id: bookingId,
        },
      })
      .catch(err => {
        logger.error(`Error deleting booking ${err}`);
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2025') {
            return new NotFoundError(`Booking ${bookingId} not found`);
          }
        }
        return new Error(err);
      });

    return booking;
  }

  /**
   * Gets a specific booking from the database by id
   *
   * @memberof BookingDAO
   */
  async getBooking(bookingId: number): Promise<Booking | Error> {
    logger.debug(`Getting booking from database, ${bookingId}`);

    const booking = await prisma.booking
      .findUnique({
        where: {
          id: bookingId,
        },
      })
      .then(value =>
        value === null
          ? new NotFoundError(`Booking ${bookingId} not found`)
          : value
      )
      .catch(err => {
        logger.error(`Error getting booking ${err}`);
        return new Error(err);
      });

    return booking;
  }

  /**
   * Gets a list of bookings from the database based on a filter
   *
   * @memberof BookingDAO
   */
  async getBookings(
    filter: BookingsFilter
  ): Promise<PaginatedBookings | Error> {
    logger.debug(
      `Getting bookings with the following filter: ${JSON.stringify(filter)}`
    );

    // TODO: facility filter
    const queryWhere: Prisma.BookingWhereInput = {
      userId: filter.user,
      starts: {
        ...(filter.start && {gte: new Date(filter.start).toISOString()}),
        ...(filter.end && {lte: new Date(filter.end).toISOString()}),
      },
      ...(filter.activity && {
        event: {
          activityId: filter.activity,
        },
      }),
      ...(filter.event && {eventId: filter.event}),
    };

    logger.debug(`Get bookings query: ${JSON.stringify(queryWhere)}`);

    // TODO: Implement `filter.sort`
    const queryOrderBy: Prisma.Enumerable<Prisma.BookingOrderByWithRelationInput> =
      {};

    const bookingQuery = await prisma
      .$transaction([
        prisma.booking.count({where: queryWhere}),
        prisma.booking.findMany({
          where: queryWhere,
          skip:
            filter.page && filter.limit && filter.page > 1
              ? (filter.page - 1) * filter.limit
              : undefined,
          take: filter.limit,
          orderBy: queryOrderBy,
        }),
      ])
      .then(([count, bookings]) => {
        return {count, bookings: bookings.map(b => bookingToDTO(b))};
      })
      .catch(err => {
        logger.error(`Error getting bookings: ${err}`);
        return new Error(err);
      });

    // return the error if it is one
    if (bookingQuery instanceof Error) return bookingQuery;

    // if not, return in paginated form
    return {
      bookings: bookingQuery.bookings,
      metadata: {
        count: bookingQuery.count,
        limit: filter.limit ?? 0,
        page: filter.page ?? 1,
        pageCount: Math.ceil(
          bookingQuery.count / (filter.limit ?? bookingQuery.count)
        ),
      },
    };
  }
}

export default new BookingDAO();
