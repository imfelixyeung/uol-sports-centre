import winston from 'winston';
import {env} from '@/env';

const logLevel = env.DEBUG ? 'debug' : 'info';
const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.json(),
  defaultMeta: {service: 'booking-service'},
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({filename: 'combined.log'}),
  ],
});

logger.info(`Initialised logger in '${logLevel}' mode`);

export default logger;
