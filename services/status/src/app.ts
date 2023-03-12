import express, {Express} from 'express';
import statusRouter from './routers/status.js';
import healthRouter from './routers/health.js';

export const createApp = (): Express => {
  const app = express();

  app.use('/', statusRouter);
  app.use('/health', healthRouter);

  return app;
};
