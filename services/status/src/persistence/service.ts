import {db} from '~/utils/db';

export class ServiceRegistry {
  static async addService(service: string) {
    const data = await db.service.upsert({
      where: {name: service},
      create: {name: service},
      update: {name: service},
    });
    return data.name;
  }

  static async getServices() {
    const services = await db.service.findMany({});
    return services.map(service => service.name);
  }
}
