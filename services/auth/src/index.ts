import express from 'express';
import {env} from './env';
import authRouter from './routers/auth';

const app = express();

app.use('', authRouter);

const {PORT, HOST} = env;

app.listen(PORT, HOST, () => console.log(`Listening on ${HOST}:${PORT}`));
