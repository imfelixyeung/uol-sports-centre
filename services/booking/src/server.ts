import express from 'express';
import bookingRouter from '@/router/booking';
import healthRouter from '@/router/health';
import eventRouter from '@/router/event';
import {notFoundHandler, serverErrorHandler} from '@/router/error';

/**
 * Creates the express server
 */
export const createServer = (): express.Express => {
  const app = express();

  // express middlewares
  app.use(express.json());

  // 5xx - Actual error
  app.use(serverErrorHandler);

  // routers
  app.use('/bookings', bookingRouter);
  app.use('/events', eventRouter);
  app.use('/health', healthRouter);

  // 404 - Not found
  app.use(notFoundHandler);

  return app;
};
