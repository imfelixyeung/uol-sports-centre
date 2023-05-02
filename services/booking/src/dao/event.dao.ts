import {CreateEventDTO, EventDTO, UpdateEventDTO} from '@/dto/event.dto';
import NotFoundError from '@/errors/notFound';
import httpClient from '@/lib/httpClient';
import logger from '@/lib/logger';
import prisma from '@/lib/prisma';
import {EventsFilter} from '@/types/events';
import {ActivitiesResponse} from '@/types/external';
import {Prisma} from '@prisma/client';

export type EventReturn = {
  events: EventDTO[];
  start: number | undefined;
};

/**
 * The Event DAO (Data Access Object) is used to abstract the underlying
 * database accesses from the business logic
 *
 * @class EventDAO
 */
class EventDAO {
  constructor() {
    logger.debug('Created instance of Event DAO');
  }

  /**
   * Gets a list of events from the database based on a filter
   *
   * @memberof EventDAO
   */
  async getEvents(filter: EventsFilter): Promise<EventReturn | Error> {
    logger.debug('Getting events');

    let start: number | undefined;

    // return all events if no filter is provided
    if (!filter.start && !filter.end && !filter.facility && !filter.activity) {
      return {events: await prisma.event.findMany(), start: undefined};
    }

    // if filter.facility is provided, get the activities for that facility
    let activityIds: number[] = [];

    if (filter.facility) {
      const activities = await httpClient
        .get<ActivitiesResponse>(
          'http://gateway/api/facilities/activities?page=1&limit=1000'
        )
        .catch(err => {
          logger.error(err);
          return new Error(err);
        });

      if (activities instanceof Error) return activities;

      activities.forEach(activity => {
        if (activity.facility_id === filter.facility) {
          activityIds.push(activity.id);
        }
      });

      logger.debug(`Activity ids in facility: ${JSON.stringify(activityIds)}`);
    }

    if (filter.activity) {
      // if filter.activity is provided and filter.facility is not, add filter.activity
      if (!filter.facility) {
        activityIds.push(filter.activity);
      } else {
        // set activityIds to the union of filter.activity and activityIds
        if (activityIds.includes(filter.activity)) {
          activityIds = [filter.activity];
        } else {
          activityIds = [];
        }
      }
    }

    logger.debug(`Activity ids: ${JSON.stringify(activityIds)}`);

    if (
      (filter.facility !== undefined || filter.activity !== undefined) &&
      activityIds.length === 0
    )
      return {events: [], start: undefined};

    // if start and end params provided, calculate an array of days
    const days: number[] = [];
    if (filter.start && filter.end) {
      const startDate = new Date(filter.start);
      const endDate = new Date(filter.end);

      // get a list of dates between the start and end dates (inclusive) as values of 0-6
      days.push(
        ...Array.from(
          Array(
            Math.floor((endDate.getTime() - startDate.getTime()) / 86400000) + 1
          ).keys()
        ).map(i => new Date(startDate.getTime() + i * 86400000).getDay())
      );
    } else {
      // default to all events in a week
      days.push(...Array.from(Array(7).keys()));
    }

    // add missing final day if it isnt the final day in the array
    if (filter.end && days[days.length - 1] !== new Date(filter.end).getDay()) {
      days.push(new Date(filter.end).getDay());
    }

    // add first day if it isnt the first day in the array
    if (filter.start && days[0] !== new Date(filter.start).getDay()) {
      days.unshift(new Date(filter.start).getDay());
    }

    // shift all of the days so that monday is 0
    days.forEach((day, index) => {
      days[index] = day === 0 ? 6 : day - 1;
    });

    const allEvents: EventDTO[] = [];
    const eventsByDay: (Error | EventDTO[] | null)[] = [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ];

    // for every day
    for (const [index, day] of days.entries()) {
      // if this is the first time we have seen this day, fetch the events for it
      if (eventsByDay[day] === null) {
        const events = await prisma.event
          .findMany({
            where: {
              activityId:
                activityIds.length > 0
                  ? {
                      in: activityIds,
                    }
                  : undefined,
              day,
              type: filter.type,
            },
          })
          .catch(err => {
            logger.error(`Error getting events: ${err}`);
            return new Error(err);
          });
        eventsByDay[day] = events;
      }

      // return error if it exists
      if (eventsByDay[day] instanceof Error) return eventsByDay[day] as Error;

      let daysEvents = eventsByDay[day] as EventDTO[];

      // if is first day, ensure that all the events returned are equal to or later than the start time
      if (index === 0) {
        daysEvents = daysEvents.filter(e => {
          const eventStartTime = new Date(filter.start as number).setHours(
            0,
            e.time,
            0,
            0
          );
          if (!start || eventStartTime < start) start = eventStartTime;
          return (filter.start as number) <= eventStartTime;
        });
      }

      // if is last day, ensure that all the events returned are equal to or less than the end time
      if (index === days.length - 1) {
        daysEvents = daysEvents.filter(e => {
          const eventStartTime = new Date(filter.end as number).setHours(
            0,
            e.time,
            0,
            0
          );
          return (filter.end as number) >= eventStartTime;
        });
      }

      // add all events
      allEvents.push(...daysEvents);
    }

    // return either the list of events or the error
    return {events: allEvents, start: filter.start ? start : undefined};
  }

  /**
   * Creates an event in the database
   *
   * @memberof EventDAO
   */
  async createEvent(eventData: CreateEventDTO): Promise<EventDTO | Error> {
    logger.debug(`Adding event to database, ${eventData}`);

    const event = await prisma.event
      .create({
        data: eventData,
      })
      .catch(err => {
        logger.error(`Error creating event ${err}`);
        return new Error(err);
      });

    return event;
  }

  /**
   * Gets a specific event from the database by id
   *
   * @memberof EventDAO
   */
  async getEvent(eventId: number): Promise<EventDTO | Error> {
    logger.debug(`Getting event from database, ${eventId}`);

    const event = await prisma.event
      .findUnique({
        where: {
          id: eventId,
        },
      })
      .then(value =>
        value === null ? new NotFoundError(`Event ${eventId} not found`) : value
      )
      .catch(err => {
        logger.error(`Error getting event ${err}`);
        return new Error(err);
      });

    return event;
  }

  async updateEvent(eventData: UpdateEventDTO): Promise<EventDTO | Error> {
    logger.debug(`Updating event in database, ${JSON.stringify(eventData)}`);

    // split id and the rest of the data
    const {id, ...updateData} = eventData;

    const booking = await prisma.event
      .update({
        where: {
          id: id,
        },
        data: updateData,
      })
      .catch(err => {
        logger.error(`Error updating event ${err}`);
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2025') {
            return new NotFoundError(`Event ${id} not found`);
          }
        }
        return new Error(err);
      });

    return booking;
  }

  async deleteEvent(eventId: number): Promise<Error | EventDTO> {
    logger.debug(`Deleting event in database, ${eventId}`);

    const event = await prisma.event
      .delete({
        where: {
          id: eventId,
        },
      })
      .catch(err => {
        logger.error(`Error deleting event ${err}`);
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2025') {
            return new NotFoundError(`Event ${eventId} not found`);
          }
        }
        return new Error(err);
      });

    return event;
  }
}

export default new EventDAO();
