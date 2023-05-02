import {env} from '@/env';
import logger from '@/lib/logger';
import {createServer} from '@/server';

// run the main server
const app = createServer();
app.listen(env.PORT, env.HOST, () => {
  logger.info(`Listening on http://${env.HOST}:${env.PORT}`);
});
