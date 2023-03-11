import {dbMock} from '../../singleton';

import {User} from '@prisma/client';
import {getUsers, userWithoutPassword} from '../users';

const users: User[] = [
  {
    id: 0,
    email: 'example@example.com',
    password: 'hash',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 1,
    email: 'example2@example.com',
    password: 'hash',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('userWithoutPassword', () => {
  it('should return the user without password', async () => {
    const user = {...users[0]};

    expect(userWithoutPassword(user)).toEqual({...user, password: undefined});
  });
});

describe('getUsers', () => {
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
