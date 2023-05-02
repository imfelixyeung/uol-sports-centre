import {dbMock} from '~/utils/__mocks__/db.mock';

import {User} from '@prisma/client';
import {
  getUserById,
  getUsers,
  updateUserById,
  userWithoutPassword,
} from '../users';

const users: [User, User] = [
  {
    id: 0,
    email: 'example@example.com',
    password: 'hash',
    role: 'USER',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 1,
    email: 'example2@example.com',
    password: 'hash',
    role: 'USER',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('userWithoutPassword', () => {
  userWithoutPassword;

  it('should return null if user not supplied', async () => {
    expect(userWithoutPassword(null)).toEqual(null);
  });

  it('should return the user without password', async () => {
    const user = {...users[0]};

    expect(userWithoutPassword(user)).toEqual({...user, password: undefined});
  });
});

describe('getUsers', () => {
  getUsers;

  it('should return users without password', async () => {
    dbMock.user.findMany.mockResolvedValue(users);

    expect(
      getUsers({
        pageIndex: 0,
        pageSize: 10,
      })
    ).resolves.toEqual(users.map(userWithoutPassword));
  });
});

describe('getUserById', () => {
  getUserById;

  it('should return user without password', () => {
    dbMock.user.findUnique.mockResolvedValue(users[0]);
    expect(getUserById(0)).resolves.toEqual(userWithoutPassword(users[0]));
  });
});

describe('updateUserById', () => {
  updateUserById;

  it('should update user', async () => {
    dbMock.user.findUnique.mockResolvedValue(users[0]);
    dbMock.user.update.mockResolvedValue(users[0]);

    const result = await updateUserById(0, {role: 'ADMIN'});

    expect(result).toEqual(userWithoutPassword(users[0]));
    expect(dbMock.user.update).toBeCalled();
  });
});
