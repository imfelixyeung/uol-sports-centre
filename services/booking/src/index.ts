import express from 'express';
import {env} from './env';
import bookingRouter from './router/booking';

const app = express();

app.use('/', bookingRouter);

app.listen(env.PORT, env.HOST, () => {
  console.log(`Listening on ${env.HOST}:${env.PORT}`);
});
