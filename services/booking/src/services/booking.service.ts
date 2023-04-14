import bookingDao from '@/dao/booking.dao';
import eventDao from '@/dao/event.dao';
import {
  BookBookingDTO,
  CreateBookingDTO,
  PossibleBookingDTO,
  UpdateBookingDTO,
} from '@/dto/booking.dto';
import httpClient from '@/lib/httpClient';
import logger from '@/lib/logger';
import {
  PaginationFilter,
  RequiredTimeLimitFilter,
  TimeLimitFilter,
} from '@/types';
import {ActivitiesResponse, ActivityResponse} from '@/types/external';

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
    logger.debug(`Create new booking, ${JSON.stringify(bookingData)}`);

    return await bookingDao.addBooking(bookingData);
  }

  /**
   * Get multiple bookings which are paginatable with page and limit params
   *
   * @memberof BookingService
   */
  async get(filter: PaginationFilter & TimeLimitFilter = {}) {
    logger.debug(`Get bookings, limit: ${filter.limit}, page: ${filter.page}`);

    return await bookingDao.getBookings(filter);
  }

  /**
   * Get paginatable list of bookings for the user
   *
   * @memberof BookingService
   */
  async getUserBookings(filter: {user: number} & PaginationFilter) {
    logger.debug(
      `Get user ${filter.user} bookings, limit: ${filter.limit}, page: ${filter.page}`
    );
    return await bookingDao.getBookings(filter);
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
    filter: {facility?: number; activity?: number} & RequiredTimeLimitFilter
  ) {
    // first we will get the events that fit within the specified filters
    const validEvents = await eventDao.getEvents(filter).catch(err => {
      logger.error(`Error getting list of valid events, ${err}`);
      return new Error(err);
    });

    // return the error if occurs
    if (validEvents instanceof Error) return validEvents;

    // update start
    if (validEvents.start) filter.start = validEvents.start;

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

    // return the error if occurred
    if (activities instanceof Error) return activities;

    const possibleBookings: PossibleBookingDTO[] = [];

    logger.debug(
      `Generating possible bookings for ${
        validEvents.events.length
      } events and filters ${JSON.stringify(filter)}`
    );

    logger.debug(`Valid events: ${JSON.stringify(validEvents)}`);

    // check if there are any valid events
    if (validEvents.events.length > 0) {
      let currentDay = validEvents.events[0]!.day;
      let currentDayCount = 0;

      // for each event, generate a list of possible bookings
      validEvents.events.forEach(event => {
        const activity = activities.find(a => a.id === event.activityId);
        if (!activity) {
          logger.error(
            `Unable to find activity id ${event.activityId} in activities`
          );
          return; // continue
        }

        // count days between this instance of the event and the start of the filter
        logger.debug(
          `Current day: ${currentDay} | Event day: ${event.day} | Count: ${currentDayCount}`
        );
        if (currentDay !== event.day) {
          currentDay = event.day;
          currentDayCount++;
          logger.debug('incremented day');
        }

        const timeSlots = event.duration / activity.duration;

        // for each timeslot, generate a possible booking
        for (let i = 0; i < timeSlots; i++) {
          // calculate start and end time, then check whether they fit within the bounds
          const bookingStartTime =
            new Date(filter.start).setHours(0, 0, 0, 0) +
            (event.time + i * activity.duration) * 60 * 1000 +
            currentDayCount * 24 * 60 * 60 * 1000;

          const bookingEndTime =
            bookingStartTime + activity.duration * 60 * 1000;

          // if booking starts before the filter or booking ends after the filter,
          // we dont add it as a possible booking

          if (
            (filter.start && bookingStartTime <= filter.start) ||
            (filter.end && bookingEndTime >= filter.end)
          ) {
            logger.debug(
              `Booking doesn't fit within filter, ${bookingStartTime}`
            );
            logger.debug(
              filter.start && bookingStartTime <= filter.start
                ? 'Booking starts before filter'
                : 'Booking starts after filter'
            );
            continue;
          }

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
    }

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
    _filter: {
      facility?: number;
      activity?: number;
    } & PaginationFilter &
      TimeLimitFilter = {}
  ) {
    // if start and end are unset, use today from 00:00 to 23:59
    const filter = {
      start: _filter.start ?? new Date().setHours(0, 0, 0, 0),
      end: _filter.end ?? new Date().setHours(23, 59, 59, 999),
      ..._filter,
    };

    logger.debug(`Get available bookings filters: ${JSON.stringify(filter)}`);

    // lets check how many days are between the start and the end to make sure
    // we dont generate way too many responses
    const numDays = Math.floor(
      (filter.end - filter.start) / (24 * 60 * 60 * 1000)
    );
    if (numDays > 14)
      return new Error(
        'Too many days between specified date range. Max date range is 14 days (2 weeks)'
      );

    // generate list of all possible bookings (not necessarily available)
    let possibleBookings = await this.generatePossibleBookings(filter).catch(
      err => {
        return new Error(err);
      }
    );

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
    const currentBookings = await bookingDao.getBookings(filter);

    // if error, return it
    if (currentBookings instanceof Error) return currentBookings;

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

  async book(bookingData: BookBookingDTO) {
    // check that it is possible to book this booking

    // get the event that relates to the prospective booking
    const event = await eventDao.getEvent(bookingData.event);
    if (event instanceof Error) return event;

    // ensure that team events cannot be booked
    if (event.type === 'TEAM_EVENT')
      return new Error('Team events are not bookable');

    // for both session and open_use we need to check the number of bookings
    // with the same event id and the same start time
    const bookings = await bookingDao.getBookings({
      event: event.id,
      start: bookingData.starts,
      end: bookingData.starts,
    });
    if (bookings instanceof Error) return bookings;

    if (event.type === 'SESSION') {
      // check if 1 booking exists
      if (bookings.metadata.count >= 1)
        return new Error('Unable to book session, booking already exists');
    } else {
      // get capacity information from facilities
      const activity = await httpClient
        .get<ActivityResponse>(
          `http://gateway/api/facilities/activities/${event.activityId}`
        )
        .catch(err => {
          logger.error(err);
          return new Error(err);
        });
      if (activity instanceof Error) return activity;

      if (bookings.metadata.count >= activity.capacity)
        return new Error('Unable to book session, capacity is full');
    }

    // must be okay to book
    const newBooking = await this.create({
      eventId: bookingData.event,
      starts: new Date(bookingData.starts),
      userId: bookingData.user,
    });

    return newBooking;
  }
}

export default new BookingService();
