// This file is used to check the health of the service
import {db} from '../utils/db';

export const getHealth = async () => {
  // Check the database health
  const databaseHealth = await getDatabaseHealth();
  return {
    status: databaseHealth ? 'healthy' : 'degraded',
  };
};

const getDatabaseHealth = async () => {
  try {
    // Attempt to query the database
    await db.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed', error);
    return false;
  }
};
