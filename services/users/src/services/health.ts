import {db} from '../utils/db';

export const getHealth = async () => {
  const databaseHealth = await getDatabaseHealth();
  return {
    healthy: databaseHealth,
    services: [
      {
        name: 'database',
        healthy: databaseHealth,
      },
    ],
  };
};

const getDatabaseHealth = async () => {
  try {
    // attempt to query the database
    await db.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    return false;
  }
};
