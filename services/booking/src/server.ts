import express from 'express';
import bookingRouter from './router/booking';
import healthRouter from './router/health';
import {notFoundHandler, serverErrorHandler} from './router/error';

export const createServer = (): express.Express => {
  const app = express();

  // express middlewares
  app.use(express.json());

  // routers
  app.use('/bookings', bookingRouter);
  app.use('/health', healthRouter);

  // error handling
  // 404 - Not found
  app.use(notFoundHandler);

  // 5xx - Actual error
  app.use(serverErrorHandler);

  return app;
};
