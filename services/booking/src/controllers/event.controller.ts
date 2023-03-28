import express from 'express';
import logger from '@/lib/logger';
import eventService from '@/services/event.service';
import {z} from 'zod';
import {id, timestamp} from '@/schema';
import {CreateEventDTO, UpdateEventDTO} from '@/dto/event.dto';
import {EventType} from '@prisma/client';
import {Request} from 'express-jwt';
import {UserRole} from '@/middleware/auth';

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

  async createEvent(req: Request, res: express.Response) {
    logger.debug('Received createEvent request');

    // if not admin, return 403
    if (req.auth?.user.role !== UserRole.ADMIN) {
      return res.status(403).json({
        status: 'error',
        error: 'Unauthorized',
      });
    }

    // get post body information
    const createEventBodySchema = z.object({
      name: z.string(),
      activityId: id('activity id'),
      day: z.number(),
      time: z.number(),
      duration: z.number(),
      type: z.nativeEnum(EventType),
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

  async updateEventById(req: Request, res: express.Response) {
    logger.debug('Received updateEventById request');

    // if not admin, return 403
    if (req.auth?.user.role !== UserRole.ADMIN) {
      return res.status(403).json({
        status: 'error',
        error: 'Unauthorized',
      });
    }

    // get post body information
    const updateEventBodySchema = z.object({
      name: z.string().optional(),
      activityId: id('activity id').optional(),
      day: z.number().optional(),
      time: z.number().optional(),
      duration: z.number().optional(),
      type: z.nativeEnum(EventType).optional(),
    });

    const updateEventParamsSchema = z.object({
      id: id('booking id'),
    });

    // ensure the request params abide by that schema
    const body = updateEventBodySchema.safeParse(req.body);
    const params = updateEventParamsSchema.safeParse(req.params);
    if (!body.success)
      return res.status(400).json({
        status: 'error',
        message: 'malformed body',
        error: body.error,
      });

    if (!params.success)
      return res.status(400).json({
        status: 'error',
        message: 'malformed parameters',
        error: params.error,
      });

    // create the new event
    const eventData: UpdateEventDTO = {id: params.data.id, ...body.data};
    const updatedEvent = await eventService.update(eventData).catch(err => {
      logger.error(`Unable to update event: ${err}`);
      return new Error(err);
    });

    if (eventData instanceof Error) {
      return res.status(500).send({
        status: 'error',
        error: 'Unable to update event',
      });
    }
    // after passing all the above checks, the booking should be okay
    return res.status(200).send({
      status: 'OK',
      event: updatedEvent,
    });
  }

  async deleteEventById(req: Request, res: express.Response) {
    logger.debug('Received deleteEventById request');

    // if not admin, return 403
    if (req.auth?.user.role !== UserRole.ADMIN) {
      return res.status(403).json({
        status: 'error',
        error: 'Unauthorized',
      });
    }

    // get post body information
    const deleteEventParamsSchema = z.object({
      id: id('event id'),
    });

    // ensure the request params abide by that schema
    const params = deleteEventParamsSchema.safeParse(req.params);
    if (!params.success)
      return res.status(400).json({
        status: 'error',
        message: 'malformed parameters',
        error: params.error,
      });

    // create the new event
    const deletedEvent = await eventService
      .delete(params.data.id)
      .catch(err => {
        logger.error(`Unable to delete event: ${err}`);
        return new Error(err);
      });

    if (deletedEvent instanceof Error) {
      return res.status(500).send({
        status: 'error',
        error: 'Unable to delete event',
      });
    }
    // after passing all the above checks, the booking should be okay
    return res.status(200).send({
      status: 'OK',
      event: deletedEvent,
    });
  }
}

export default new EventController();
