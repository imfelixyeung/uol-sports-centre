import {EventDTO} from '@/dto/event.dto';
import logger from '@/lib/logger';
import prisma from '@/lib/prisma';
import {EventsFilter} from '@/types/events';

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
  async getEvents(filter: EventsFilter): Promise<EventDTO[] | Error> {
    logger.debug('Getting events');

    // if start and end params provided, calculate an array of days
    const days: number[] = [];
    if (filter.start && filter.end) {
      // for each date, starting from the start and adding 1 day each iteration
      // until greater than the end date
      for (
        let dt = new Date(filter.start);
        dt <= new Date(filter.end);
        dt.setDate(dt.getDate() + 1)
      ) {
        // add numerical representation of the day (0-6) to array
        // in js 0 is sunday however we want the days to start from monday

        let day = new Date(dt).getDay();
        day = day === 0 ? 6 : day - 1;
        days.push(day);
      }
    }

    // logger.debug(`Days: ${JSON.stringify(days)}`);

    // TODO: fix every day not returning events if days > 1 week
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
              activityId: filter.activity,
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

      console.log(`${JSON.stringify(eventsByDay[day])}`);

      // return error if it exists
      if (eventsByDay[day] instanceof Error) return eventsByDay[day] as Error;

      let daysEvents = eventsByDay[day] as EventDTO[];

      logger.debug(`Days events: ${JSON.stringify(daysEvents)}`);

      // TODO: if is first day, ensure that all the events returned are equal to or later than the start time
      if (index === 0)
        daysEvents = daysEvents.filter(e => {
          const eventStartTime = new Date(filter.start as number).setHours(
            0,
            e.time,
            0,
            0
          );
          logger.debug(
            `Test ${filter.start} <= ${eventStartTime} : ${
              (filter.start as number) <= eventStartTime
            }`
          );
          return (filter.start as number) <= eventStartTime;
        });

      // TODO: if is last day, ensure that all the events returned are equal to or less than the end time
      if (index === days.length - 1)
        daysEvents = daysEvents.filter(e => {
          const eventStartTime = new Date(filter.end as number).setHours(
            0,
            e.time,
            0,
            0
          );

          logger.debug(
            `Test ${filter.end} >= ${eventStartTime} : ${
              (filter.end as number) >= eventStartTime
            }`
          );
          return (filter.end as number) >= eventStartTime;
        });

      // add all events
      allEvents.push(...daysEvents);
    }

    // return either the list of events or the error
    return allEvents;
  }
}

export default new EventDAO();
