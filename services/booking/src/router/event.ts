import express, {Router} from 'express';
import {expressjwt as jwt} from 'express-jwt';

import EventController from '@/controllers/event.controller';
import {authErrorHandler} from './error';
import {adminOnly, jwtArgs} from '@/middleware/auth';

const eventRouter: Router = express.Router();

// get all events
eventRouter.get('/', EventController.getEvents);

// create new event
eventRouter.post('/', jwt(jwtArgs), adminOnly, EventController.createEvent);

// get specific event
// eventRouter.get('/:id', EventController.getEventById);

// update specific event
eventRouter.put(
  '/:id',
  jwt(jwtArgs),
  adminOnly,
  EventController.updateEventById
);

// delete specific event
// eventRouter.delete(
//   '/:id',
//   jwt(jwtArgs),
//   adminOnly,
//   EventController.deleteEventById
// );

eventRouter.use(authErrorHandler);

export default eventRouter;
