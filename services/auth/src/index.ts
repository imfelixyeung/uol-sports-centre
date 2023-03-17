import cron from 'node-cron';
import {createApp} from './app';
import {env} from './env';
import {deleteExpiredTokens} from './services/auth';

const app = createApp();

// start cron jobs
cron.schedule('0 * * * *', deleteExpiredTokens);

const {PORT, HOST} = env;

app.listen(PORT, HOST, () => console.log(`Listening on ${HOST}:${PORT}`));
