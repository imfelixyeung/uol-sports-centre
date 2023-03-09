import express from 'express';
import {env} from './env/index.js';
import statusRouter from './routers/status.js';
import healthRouter from './routers/health.js';
import cron from 'node-cron';
import {
  registerServices,
  removeOldHealthCheckSnapshots,
  takeServicesHealthCheckSnapshot,
} from './services/status.js';
import {
  CRON_EXPRESSION_PURGE,
  CRON_EXPRESSION_SNAPSHOT,
} from './config/index.js';

const app = express();

app.use('/', statusRouter);
app.use('/health', healthRouter);

registerServices([
  'auth',
  'booking',
  'facilities',
  'management',
  'payments',
  'status',
  'users',
  'web',
])
  .then(() => console.log('Services registered'))
  .catch(error => console.error('Error registering services', error));

cron.schedule(CRON_EXPRESSION_SNAPSHOT, takeServicesHealthCheckSnapshot);
cron.schedule(CRON_EXPRESSION_PURGE, removeOldHealthCheckSnapshots);

const {PORT, HOST} = env;

app.listen(PORT, HOST, () => console.log(`Listening on ${HOST}:${PORT}`));
