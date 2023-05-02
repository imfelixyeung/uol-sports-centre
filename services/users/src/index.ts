import express from 'express';
import {env} from './env';
import healthRouter from './routers/health';
import userRouter from './routers/users';
const app = express();

app.use(express.json());
app.use('/health', healthRouter);
app.use('/', userRouter);

app.listen(env.PORT, env.HOST, () => {
  console.log(`Listening on ${env.HOST}:${env.PORT}`);
});
