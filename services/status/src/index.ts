import express from 'express';
import {env} from './env/index.js';
import reportRouter from './routers/report.js';
import healthRouter from './routers/health.js';

const app = express();

app.use('/report', reportRouter);
app.use('/health', healthRouter);

const {PORT, HOST} = env;

app.listen(PORT, HOST, () => console.log(`Listening on ${HOST}:${PORT}`));
