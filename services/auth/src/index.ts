import express from 'express';
import cron from 'node-cron';
import {env} from './env';
import authRouter from './routers/auth';
import healthRouter from './routers/health';
import {deleteExpiredTokens} from './services/auth';

const app = express();

app.use(express.json());
app.use('/', authRouter);
app.use('/users', usersRouter);
app.use('/health', healthRouter);

// start cron jobs
cron.schedule('0 * * * *', deleteExpiredTokens);

const {PORT, HOST} = env;

app.listen(PORT, HOST, () => console.log(`Listening on ${HOST}:${PORT}`));
