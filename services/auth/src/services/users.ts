import {User} from '@prisma/client';
import {UserRole} from '~/config';
import {UserRegistry} from '~/persistence/users';

export const userWithoutPassword = (user: User | null) => {
  if (!user) return null;

  const {createdAt, email, id, role, updatedAt} = user;
  return {id, email, role, createdAt, updatedAt};
};

export const getUsers = async (
  options: {
    pageIndex: number;
    pageSize: number;
  },
  filters: {role?: UserRole} = {}
) => {
  const {pageIndex, pageSize} = options;
  const users = await UserRegistry.getAllUsers(
    {
      skip: pageIndex * pageSize,
      take: pageSize,
    },
    filters
  );
  return users.map(userWithoutPassword);
};

export const getUserById = async (userId: number) => {
  const user = await UserRegistry.getUserById(userId);
  return userWithoutPassword(user);
};

export const updateUserById = async (
  userId: number,
  data: {role?: UserRole}
) => {
  const newUser = await UserRegistry.updateUserById(userId, data);
  return userWithoutPassword(newUser);
};
