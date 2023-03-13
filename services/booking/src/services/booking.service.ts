import bookingDao from '@/dao/booking.dao';
import eventDao from '@/dao/event.dao';
import {
  BookingDTO,
  CreateBookingDTO,
  UpdateBookingDTO,
} from '@/dto/booking.dto';
import httpClient from '@/lib/httpClient';
import logger from '@/lib/logger';
import {ActivitiesResponse} from '@/types/external';

/**
 * The Booking Service performs any required business logic before updating the
 * database
 *
 * @class BookingService
 */
class BookingService {
  constructor() {
    logger.debug('Created instance of Booking Service');
  }

  /**
   * Create a new booking
   *
   * @memberof BookingService
   */
  async create(bookingData: CreateBookingDTO) {
    logger.debug(`Create new booking, ${bookingData}`);

    return await bookingDao.addBooking(bookingData);
  }

  /**
   * Get multiple bookings which are paginatable with page and limit params
   *
   * @memberof BookingService
   */
  async get(limit?: number, page?: number) {
    logger.debug(`Get bookings, limit: ${limit}, page: ${page}`);

    return await bookingDao.getBookings({limit, page});
  }

  /**
   * Get paginatable list of bookings for the user
   *
   * @memberof BookingService
   */
  async getUserBookings(user: number, limit?: number, page?: number) {
    logger.debug(`Get user ${user} bookings, limit: ${limit}, page: ${page}`);
    return await bookingDao.getBookings({user, limit, page});
  }

  /**
   * Get a single booking by id
   *
   * @memberof BookingService
   */
  async getById(id: number) {
    logger.debug(`Get booking by id, ${id}`);

    return await bookingDao.getBooking(id);
  }

  /**
   * Update a booking
   *
   * @memberof BookingService
   */
  async update(bookingData: UpdateBookingDTO) {
    logger.debug(`Update booking by id, ${bookingData.id}, ${bookingData}`);

    return await bookingDao.editBooking(bookingData);
  }

  /**
   * Delete a booking by id
   *
   * @memberof BookingService
   */
  async deleteById(id: number) {
    logger.debug(`Delete booking by id, ${id}`);

    return await bookingDao.deleteBooking(id);
  }

  /**
   * Get a list of available bookings given the current filters. All of the
   * filters are optional which means that there are a number of fallback
   * filters to use if unspecified. They are:
   *
   * - start: 00:00 of the current day
   * - end: 23:59 of the current day
   * - facility: all facilities searched
   * - activity: all activities searched
   *
   * pagination (the limits will likely be changed to enforce the use of pagination)
   * - limit: no limit (all returned)
   * - page: will default to 1
   *
   * @memberof BookingService
   */
  async getAvailableBookings(
    start?: number,
    end?: number,
    facility?: number,
    activity?: number,
    limit?: number,
    page?: number
  ) {
    if (!start) start = new Date().setHours(0, 0, 0);
    if (!end) end = new Date().setHours(23, 59, 59);

    // first we will get the events that fit within the specified filters
    const validEvents = await eventDao.getEvents({
      facility,
      activity,
      start,
      end,
    });

    // return the error if occurs
    if (validEvents instanceof Error) return validEvents;

    // next we need to get a list of activities to access information on how
    // long each instance of an activity will be
    const activities = await httpClient
      .get<ActivitiesResponse>(
        'http://gateway/api/facilities/activities?page=1&limit=1000'
      )
      .catch(err => {
        logger.error(err);
        return new Error(err);
      });

    // return the error if occured
    if (activities instanceof Error) return activities;

    const possibleBookings: BookingDTO[] = [];

    // for each event, generate a list of possible bookings
    validEvents.forEach(event => {
      const activity = activities.find(a => a.id === event.activityId);
      if (!activity) {
        logger.error(
          `Unable to find activity id ${event.activityId} in activities`
        );
        return; // continue
      }

      const timeSlots = event.duration / activity.duration;
      // logger.debug(`${timeSlots} ${activity.duration}m slots in ${event.name}`);

      // for each timeslot, generate a possible booking
      for (let i = 0; i < timeSlots; i++) {
        const booking: BookingDTO = {
          starts: new Date(
            new Date(start || new Date()).setMinutes(
              event.time + i * activity.duration
            )
          ).toISOString(),
          duration: activity.duration,
          eventId: event.id,

          // TODO: create new type for possible booking
          id: 0,
          transactionId: 0,
          userId: 0,
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
        };

        possibleBookings.push(booking);
        // logger.debug(booking);
      }
    });

    // get all existing booking for the range specified
    const currentBookings = await bookingDao.getBookings({
      facility,
      activity,
      limit,
      page,
      start,
      end,
    });

    // check capacity of open_use events
    // check availability based on sessions and team events
    // remove them from the list of possible bookings

    return possibleBookings;
  }
}

export default new BookingService();
