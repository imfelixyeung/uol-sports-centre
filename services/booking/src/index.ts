import express from 'express';
import {env} from './env';
import logger from './logger';
import bookingRouter from './router/booking';

const main = () => {
  const app = express();

  app.use('/', bookingRouter);

  app.listen(env.PORT, env.HOST, () => {
    logger.info(`Listening on http://${env.HOST}:${env.PORT}`);
  });
};

// run the main function
main();
