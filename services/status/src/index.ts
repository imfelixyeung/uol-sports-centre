import express from 'express';
import {env} from './env/index.js';
import reportRouter from './routers/report.js';

const app = express();

app.use('/report', reportRouter);

const {PORT, HOST} = env;

app.listen(PORT, HOST, () => console.log(`Listening on ${HOST}:${PORT}`));
