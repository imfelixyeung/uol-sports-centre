import express, {Express} from 'express';
import healthRouter from './routers/health.js';
import statusRouter from './routers/status.js';

export const createApp = (): Express => {
  const app = express();

  app.use('/', statusRouter);
  app.use('/health', healthRouter);

  return app;
};
