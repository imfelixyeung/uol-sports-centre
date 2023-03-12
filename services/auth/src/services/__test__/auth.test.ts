import {dbMock} from '../../singleton';

import {User} from '@prisma/client';
import {z} from 'zod';
import {jsonWebTokenSchema} from '~/schema/jwt';
import {
  deleteExpiredTokens,
  getSessionFromToken,
  refreshAccessToken,
  registerWithCredentials,
  resetPassword,
  signInWithCredentials,
  signOutToken,
} from '../auth';

const user: User = {
  id: 0,
  email: 'example@example.com',
  password: 'hash',
  role: 'user',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('registerWithCredentials', () => {
  registerWithCredentials;
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

describe('signInWithCredentials', () => {
  signInWithCredentials;
  it.todo('throws error if user does not exist');
  it.todo('throws error if user exists with incorrect credentials');
  it.todo('returns tokens if user exists with correct credentials');
});

describe('deleteExpiredTokens', () => {
  deleteExpiredTokens;
  it.todo('deletes expired tokens');
});

describe('getSessionFromToken', () => {
  getSessionFromToken;
  it.todo('throws error if token is invalid');
  it.todo('returns token if it is valid');
});

describe('refreshAccessToken', () => {
  refreshAccessToken;
  it.todo('throws error if access token is invalid');
  it.todo('throws error if refresh token is invalid');
  it.todo('returns tokens if success');
});

describe('resetPassword', () => {
  resetPassword;
  it.todo('throws error if user does not exist');
  it.todo('throws error if wrong password is supplied');
  it.todo('updates user password with new password if success');
});

describe('signOutToken', () => {
  signOutToken;
  it.todo('deletes refresh token associated with the token');
  it.todo('deletes the token');
});
