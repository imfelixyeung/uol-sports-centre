import dayjs from 'dayjs';
import {HISTORY_WITHIN, SNAPSHOT_TTL} from '~/config';
import {ServiceStatusSnapshot} from '~/types/status';
import {db} from '~/utils/db';

export class HealthCheckRegistry {
  static async addServiceHealthCheck(healthCheck: ServiceStatusSnapshot) {
    await db.service.update({
      where: {name: healthCheck.service},
      data: {
        healthChecks: {
          create: {
            status: healthCheck.status,
            statusCode: healthCheck.statusCode,
            timestamp: new Date(healthCheck.timestamp),
          },
        },
      },
    });
  }

  static async getHistory() {
    const servicesWithHealthChecks = await db.service.findMany({
      select: {
        name: true,
        healthChecks: {
          where: {
            timestamp: {
              gte: dayjs().subtract(HISTORY_WITHIN, 'milliseconds').toDate(),
            },
          },
          select: {
            timestamp: true,
            status: true,
            statusCode: true,
          },
        },
      },
    });
    return servicesWithHealthChecks;
  }

  static async getLatest() {
    const servicesWithHealthChecks = await db.service.findMany({
      select: {
        name: true,
        healthChecks: {
          orderBy: {
            timestamp: 'desc',
          },
          take: 1,
          select: {
            timestamp: true,
            status: true,
            statusCode: true,
          },
        },
      },
    });
    return servicesWithHealthChecks;
  }

  static async removeOldHealthChecks() {
    await db.healthCheck.deleteMany({
      where: {
        timestamp: {
          lte: dayjs().subtract(SNAPSHOT_TTL, 'milliseconds').toDate(),
        },
      },
    });
  }
}
