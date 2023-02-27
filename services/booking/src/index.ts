import express from 'express';
import {env} from './env';
import logger from './logger';
import bookingRouter from './router/booking';

export const createServer = (): express.Express => {
  const app = express();

  app.use('/', bookingRouter);

  return app;
};

// run the main server
const app = createServer();
app.listen(env.PORT, env.HOST, () => {
  logger.info(`Listening on http://${env.HOST}:${env.PORT}`);
});
