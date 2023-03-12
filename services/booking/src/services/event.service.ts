import eventDao from '@/dao/event.dao';
import logger from '@/lib/logger';
import {EventsFilter} from '@/types/events';

/**
 * The Event Service performs any required business logic before updating the
 * database
 *
 * @class EventService
 */
class EventService {
  constructor() {
    logger.debug('Created instance of Event Service');
  }

  /**
   * Get all the events
   *
   * @memberof EventService
   */
  async get(filter: EventsFilter) {
    logger.debug('Get events');
    return await eventDao.getEvents(filter);
  }
}

export default new EventService();
