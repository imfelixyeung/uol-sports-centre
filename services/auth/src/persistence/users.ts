import {Prisma} from '@prisma/client';
import {UserRole} from '~/config';
import {Credentials} from '~/schema/credentials';
import {db} from '~/utils/db';

export class UserRegistry {
  static async getAllUsers(
    pagination: {skip: number; take: number},
    filters: {role?: UserRole} = {}
  ) {
    const {skip, take} = pagination;
    const {role} = filters;
    const users = await db.user.findMany({
      skip,
      take,
      where: {role},
    });
    return users;
  }

  static async getUserById(userId: number) {
    const user = await db.user.findUnique({where: {id: userId}});
    return user;
  }

  static async getUserByEmail(email: string) {
    const user = await db.user.findUnique({where: {email}});
    return user;
  }

  static async updatePassword(id: number, password: string) {
    const user = await db.user.update({
      where: {id},
      data: {password},
    });
    return user;
  }

  static async createUser(credentials: Credentials) {
    const {email, password} = credentials;
    const user = await db.user.create({
      data: {email, password},
    });
    return user;
  }

  static async updateUserById(userId: number, data: Prisma.UserUpdateInput) {
    const user = await UserRegistry.getUserById(userId);
    if (!user) return null;

    const newUser = await db.user.update({where: {id: userId}, data});
    return newUser;
  }
}
