import express from 'express';
import logger from '@/lib/logger';
import eventService from '@/services/event.service';
import {z} from 'zod';
import {id, timestamp} from '@/schema';
import {CreateEventDTO} from '@/dto/event.dto';

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

  async createEvent(req: express.Request, res: express.Response) {
    logger.debug('Received createEvent request');

    // get post body information
    const createEventBodySchema = z.object({
      name: z.string(),
      activityId: id('activity id'),
      day: z.number(),
      time: z.number(),
      duration: z.number(),
      type: z.enum(['SESSION', 'OPEN_USE', 'TEAM_EVENT']),
    });

    // ensure the request params abide by that schema
    const body = createEventBodySchema.safeParse(req.body);
    if (!body.success)
      return res.status(400).json({
        status: 'error',
        message: 'malformed parameters',
        error: body.error,
      });

    // create the new event
    const eventData: CreateEventDTO = body.data;
    const newEvent = await eventService.create(eventData).catch(err => {
      logger.error(`Unable to create event: ${err}`);
      return new Error(err);
    });

    if (eventData instanceof Error) {
      return res.status(500).send({
        status: 'error',
        error: 'Unable to create event',
      });
    }
    // after passing all the above checks, the booking should be okay
    return res.status(200).send({
      status: 'OK',
      event: newEvent,
    });
  }

  // async getEventById(req: express.Request, res: express.Response) {}
  // async updateEventById(req: express.Request, res: express.Response) {}
  // async deleteEventById(req: express.Request, res: express.Response) {}
}

export default new EventController();
