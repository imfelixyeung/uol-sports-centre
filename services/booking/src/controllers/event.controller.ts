import express from 'express';
import logger from '@/lib/logger';
import eventService from '@/services/event.service';

/**
 * The Event Controller handles the incomming network requests and validates
 * the received data before passing it on down to the EventService for the
 * respective handler
 *
 * @class EventController
 */
class EventController {
  constructor() {
    logger.debug('Created instance of Event Controller');
  }

  /**
   * Get all events
   *
   * @memberof EventController
   */
  async getEvents(req: express.Request, res: express.Response) {
    logger.debug('Received getEvents request');

    const events = await eventService.get().catch(err => {
      logger.error(`Error getting events: ${err}`);
      return new Error(err);
    });

    if (events instanceof Error) {
      return res.status(500).json({
        status: 'error',
        error: events,
      });
    }

    return res.status(200).send({
      status: 'OK',
      events,
    });
  }
}

export default new EventController();
