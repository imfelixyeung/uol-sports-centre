import express from 'express';
import {env} from './env';
import authRouter from './routers/auth';
import healthRouter from './routers/health';

const app = express();

app.use('/', authRouter);
app.use('/health', healthRouter);

const {PORT, HOST} = env;

app.listen(PORT, HOST, () => console.log(`Listening on ${HOST}:${PORT}`));
