import express from 'express';
import bookingRouter from './router/booking';

export const createServer = (): express.Express => {
  const app = express();

  app.use('/', bookingRouter);

  return app;
};
