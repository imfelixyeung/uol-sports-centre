import cron from 'node-cron';
import {createApp} from './app';
import {
  CRON_EXPRESSION_PURGE,
  CRON_EXPRESSION_SNAPSHOT,
} from './config/index.js';
import {env} from './env/index.js';
import {
  registerServices,
  removeOldHealthCheckSnapshots,
  takeServicesHealthCheckSnapshot,
} from './services/status.js';

const app = createApp();

registerServices([
  'auth',
  'booking',
  'facilities',
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
