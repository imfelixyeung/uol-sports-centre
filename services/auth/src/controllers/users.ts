import {UserRole} from '@prisma/client';
import {z} from 'zod';
import {getUserById, getUsers, updateUserById} from '~/services/users';
import {createController} from '.';

const usersControllers = {
  getUsers: createController({
    querySchema: z.object({
      pageIndex: z.coerce.number().int().gte(0).default(0),
      pageSize: z.coerce.number().int().gte(1).default(20),
      role: z.nativeEnum(UserRole).optional(),
    }),
    authRequired: true,
    roleRequired: ['ADMIN'],
    controller: async ({query}) => {
      const {pageIndex, pageSize, role} = query;
      const users = await getUsers({pageIndex, pageSize}, {role});
      return users;
    },
  }),
  getUser: createController({
    querySchema: z.object({userId: z.coerce.number()}),
    authRequired: true,
    roleRequired: ['ADMIN'],
    controller: async ({query}) => {
      const {userId} = query;
      const user = await getUserById(userId);
      return user;
    },
  }),
  patchUser: createController({
    querySchema: z.object({userId: z.coerce.number()}),
    bodySchema: z.object({
      role: z.nativeEnum(UserRole),
    }),
    authRequired: true,
    roleRequired: ['ADMIN'],
    controller: async ({query, body}) => {
      const {userId} = query;

      const user = await updateUserById(userId, body);
      if (!user) throw new Error('User not found');

      return user;
    },
  }),
};

export default usersControllers;
