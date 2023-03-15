import express, {Router} from 'express';

import EventController from '@/controllers/event.controller';

const eventRouter: Router = express.Router();

// get all events
eventRouter.get('/', EventController.getEvents);

// create new event
eventRouter.post('/', EventController.createEvent);

// get specific event
// eventRouter.get('/:id', EventController.getEventById);

// update specific event
// eventRouter.put('/:id', EventController.updateEventById);

// delete specific event
// eventRouter.delete('/:id', EventController.deleteEventById);

export default eventRouter;
