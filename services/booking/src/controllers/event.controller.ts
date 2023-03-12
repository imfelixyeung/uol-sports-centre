import express from 'express';
import logger from '@/lib/logger';
import eventService from '@/services/event.service';
import {z} from 'zod';
import {id, timestamp} from '@/schema';

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

    // create a schema, outlining what we expect from params
    const querySchema = z.object({
      start: timestamp.optional(),
      end: timestamp.optional(),
      facility: id('facility id').optional(),
      activity: id('activity id').optional(),
      type: z.enum(['SESSION', 'OPEN_USE', 'TEAM_EVENT']).optional(),
    });

    // ensure the query params abide by that schema
    const query = querySchema.safeParse(req.query);
    if (!query.success)
      return res.status(400).json({
        status: 'error',
        message: 'malformed query parameters',
        error: query.error,
      });

    const events = await eventService.get(query.data).catch(err => {
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
