import {dbMock} from '../../singleton';

import {User} from '@prisma/client';
import {z} from 'zod';
import {jsonWebTokenSchema} from '~/schema/jwt';
import {registerWithCredentials} from '../auth';

const user: User = {
  id: 0,
  email: 'example@example.com',
  password: 'hash',
  role: 'user',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('registerWithCredentials', () => {
  it('should throw error if already user exists', async () => {
    dbMock.user.findUnique.mockResolvedValue(user);

    expect(
      registerWithCredentials(
        {
          email: 'example@example.com',
          password: 'password',
        },
        {rememberMe: false}
      )
    ).rejects.toThrow();
  });

  it('should return tokens when user is new', async () => {
    dbMock.user.create.mockResolvedValue(user);

    dbMock.token.findUnique.mockResolvedValue({
      id: '0',
      userId: 0,
      token: 'token',
      expiresAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const tokens = await registerWithCredentials(
      {
        email: 'example@example.com',
        password: 'password',
      },
      {rememberMe: false}
    );

    expect(
      z
        .object({
          token: jsonWebTokenSchema,
          refreshToken: jsonWebTokenSchema,
        })
        .parse(tokens)
    ).toBeTruthy();
  });
});

describe('deleteExpiredTokens', () => {
  it.todo('implement tests');
});

describe('getSessionFromToken', () => {
  it.todo('implement tests');
});

describe('refreshAccessToken', () => {
  it.todo('implement tests');
});

describe('resetPassword', () => {
  it.todo('implement tests');
});

describe('signInWithCredentials', () => {
  it.todo('implement tests');
});

describe('signOutToken', () => {
  it.todo('implement tests');
});
