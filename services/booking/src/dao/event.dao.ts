import {EventDTO} from '@/dto/event.dto';
import logger from '@/lib/logger';
import prisma from '@/lib/prisma';

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
  async getEvents(): Promise<EventDTO[] | Error> {
    logger.debug('Getting events');

    const events: EventDTO[] | Error = await prisma.event
      .findMany()
      .catch(err => {
        logger.error(`Error getting events: ${err}`);
        return new Error(err);
      });

    // return either the list of events or the error
    return events;
  }
}

export default new EventDAO();
