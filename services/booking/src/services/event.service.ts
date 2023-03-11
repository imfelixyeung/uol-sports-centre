import eventDao from '@/dao/event.dao';
import logger from '@/lib/logger';

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
  async get() {
    logger.debug('Get events');
    return await eventDao.getEvents();
  }
}

export default new EventService();
