import ms from 'ms';

export const CRON_EXPRESSION_SNAPSHOT = '* * * * *';
export const CRON_EXPRESSION_PURGE = '* * * * *';
export const SNAPSHOT_TTL = ms('7d');
export const HISTORY_WITHIN = ms('1h');
