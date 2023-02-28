import {Credentials} from '../schema/credentials';
import {db} from '../utils/db';

export class UserRegistry {
  static async getUserByEmail(email: string) {
    const user = await db.user.findUnique({where: {email}});
    return user;
  }

  static async createUser(credentials: Credentials) {
    const {email, password} = credentials;
    const user = await db.user.create({data: {email, password}});
    return user;
  }
}
