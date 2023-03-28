import eventDao from '@/dao/event.dao';
import {CreateEventDTO, UpdateEventDTO} from '@/dto/event.dto';
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
    return await eventDao
      .getEvents(filter)
      .then(eventRes =>
        eventRes instanceof Error ? eventRes : eventRes.events
      );
  }

  async create(eventData: CreateEventDTO) {
    logger.debug(`Creating event with data: ${eventData}`);
    return await eventDao.createEvent(eventData);
  }

  async update(eventData: UpdateEventDTO) {
    logger.debug(`Updating event with data: ${eventData}`);
    return await eventDao.updateEvent(eventData);
  }

  async delete(eventId: number) {
    logger.debug(`Deleting event with id: ${eventId}`);
    return await eventDao.deleteEvent(eventId);
  }
}

export default new EventService();
