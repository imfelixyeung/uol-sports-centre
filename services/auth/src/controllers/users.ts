import {z} from 'zod';
import {createController} from '.';
import {USER_ROLES} from '../config';
import {getUserById, getUsers, updateUserById} from '../services/users';

const usersControllers = {
  getUsers: createController({
    querySchema: z.object({
      pageIndex: z.number().int().gte(0).default(0),
      pageSize: z.coerce.number().int().gte(1).default(20),
    }),
    authRequired: true,
    roleRequired: ['admin'],
    controller: async ({query}) => {
      const {pageIndex, pageSize} = query;
      const users = await getUsers({pageIndex, pageSize});
      return users;
    },
  }),
  getUser: createController({
    querySchema: z.object({userId: z.coerce.number()}),
    authRequired: true,
    roleRequired: ['admin'],
    controller: async ({query}) => {
      const {userId} = query;
      const user = await getUserById(userId);
      return user;
    },
  }),
  patchUser: createController({
    querySchema: z.object({userId: z.coerce.number()}),
    bodySchema: z.object({
      role: z.enum(USER_ROLES),
    }),
    authRequired: true,
    roleRequired: ['admin'],
    controller: async ({query, body}) => {
      const {userId} = query;

      const user = await updateUserById(userId, body);
      if (!user) throw new Error('User not found');

      return user;
    },
  }),
};

export default usersControllers;
