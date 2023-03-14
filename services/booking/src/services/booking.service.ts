import bookingDao from '@/dao/booking.dao';
import eventDao from '@/dao/event.dao';
import {
  CreateBookingDTO,
  PossibleBookingDTO,
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
   * Generates a list of possible bookings based on the input params. Note that
   * these bookings may not all be available.
   *
   * @private
   * @memberof BookingService
   */
  private async generatePossibleBookings(
    facility?: number,
    activity?: number,
    start?: number,
    end?: number
  ) {
    // first we will get the events that fit within the specified filters
    const validEvents = await eventDao
      .getEvents({
        facility,
        activity,
        start,
        end,
      })
      .catch(err => {
        logger.error(`Error getting list of valid events, ${err}`);
        return new Error(err);
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

    const possibleBookings: PossibleBookingDTO[] = [];

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

      // for each timeslot, generate a possible booking
      for (let i = 0; i < timeSlots; i++) {
        // calculate start and end time, then check whether they fit within the bounds
        const bookingStartTime = new Date(start || new Date()).setHours(
          0,
          event.time + i * activity.duration,
          0,
          0
        );
        const bookingEndTime = bookingStartTime + activity.duration * 60 * 1000;

        // if booking starts before the filter or booking ends after the filter,
        // we dont add it as a possible booking

        if (
          (start && bookingStartTime < start) ||
          (end && bookingEndTime > end)
        )
          continue;

        const possibleBooking: PossibleBookingDTO = {
          starts: new Date(bookingStartTime).toISOString(),
          duration: activity.duration,
          event,
          ...(event.type === 'OPEN_USE' && {
            capacity: {
              current: 0,
              max: activity.capacity,
            },
          }),
        };

        possibleBookings.push(possibleBooking);
      }
    });

    return possibleBookings;
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
    if (!start) start = new Date().setHours(0, 0, 0, 0);
    if (!end) end = new Date().setHours(23, 59, 59, 999);

    logger.debug({start, end, facility, activity, limit, page});

    // lets check how many days are between the start and the end to make sure
    // we dont generate way too many responses
    const numDays = Math.floor((end - start) / (24 * 60 * 60 * 1000));
    if (numDays > 100)
      return new Error('Too many days between specified date range');

    // generate list of all possible bookings (not necessarily available)
    let possibleBookings = await this.generatePossibleBookings(
      facility,
      activity,
      start,
      end
    ).catch(err => {
      return new Error(err);
    });

    // if error, catch and return
    if (possibleBookings instanceof Error) {
      logger.error(`error generating possible bookings: ${possibleBookings}`);
      return possibleBookings;
    }

    // ignore any bookings that are team events since they cannot be booked
    possibleBookings = possibleBookings.filter(
      booking => booking.event.type !== 'TEAM_EVENT'
    );

    // get all existing booking for the range specified
    const currentBookings = await bookingDao.getBookings({
      facility,
      activity,
      limit,
      page,
      start,
      end,
    });

    // if error, return it
    if (currentBookings instanceof Error) return currentBookings;

    logger.debug(`Current bookings: ${JSON.stringify(currentBookings)}`);

    // add the capacity of "open_use" events
    possibleBookings.forEach(possibleBooking => {
      if (possibleBooking.event.type !== 'OPEN_USE') return;
      if (!possibleBooking.capacity) return;

      // get the current number of bookings for that session
      const bookingsInOpenUse = currentBookings.bookings.filter(
        b =>
          b.eventId === possibleBooking.event.id &&
          b.starts === possibleBooking.starts
      );

      possibleBooking.capacity.current = bookingsInOpenUse.length;
    });

    // filter out all open use sessions that are at or over capacity
    possibleBookings = possibleBookings.filter(
      b =>
        b.event.type !== 'OPEN_USE' ||
        (b.event.type === 'OPEN_USE' &&
          b.capacity &&
          b.capacity.current < b.capacity.max)
    );

    // check availability based on sessions
    // Desc: includes all bookings that are not session based or all bookings
    // that are sessions and that a booking does not exist with the same event
    // id and start time
    possibleBookings = possibleBookings.filter(
      b =>
        b.event.type !== 'SESSION' ||
        (b.event.type === 'SESSION' &&
          !currentBookings.bookings.find(
            cb => cb.eventId === b.event.id && cb.starts === b.starts
          ))
    );

    return possibleBookings;
  }
}

export default new BookingService();
