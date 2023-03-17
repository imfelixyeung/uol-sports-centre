import express, {Express} from 'express';
import authRouter from './routers/auth';
import healthRouter from './routers/health';
import usersRouter from './routers/users';

export const createApp = (): Express => {
  const app = express();

  app.use(express.json());
  app.use('/', authRouter);
  app.use('/users', usersRouter);
  app.use('/health', healthRouter);

  return app;
};
