import logger from '@/lib/logger';
import prisma from '@/lib/prisma';

/**
 * The Health Service performs any required business logic before updating the
 * database
 *
 * @class BookingService
 */
class HealthService {
  constructor() {
    logger.debug('Created instance of Health Service');
  }

  /**
   * Returns the health status of the service
   *
   * @memberof HealthService
   */
  async getHealth() {
    return {
      service: true,
      database: await this.getDatabaseHealth(),
    };
  }

  /**
   * Get the health of the databases connection
   *
   * @memberof HealthService
   */
  async getDatabaseHealth() {
    try {
      // test the connection to the database is good
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new HealthService();
