import eventDao from '@/dao/event.dao';
import {CreateEventDTO} from '@/dto/event.dto';
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

  async create(eventData: CreateEventDTO) {
    logger.debug(`Creating event with data: ${eventData}`);
    return await eventDao.createEvent(eventData);
  }
}

export default new EventService();
