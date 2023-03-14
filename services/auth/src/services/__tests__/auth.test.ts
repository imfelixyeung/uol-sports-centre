import '~/env/__mocks__/index.mock';
import {dbMock} from '~/utils/__mocks__/db.mock';

import {RefreshToken, Token, User} from '@prisma/client';
import bcrypt from 'bcrypt';
import {z} from 'zod';
import {RefreshTokenRegistry} from '~/persistence/refresh-tokens';
import {TokenRegistry} from '~/persistence/tokens';
import {Credentials} from '~/schema/credentials';
import {jsonWebTokenPayloadSchema, jsonWebTokenSchema} from '~/schema/jwt';
import {
  deleteExpiredTokens,
  getSessionFromToken,
  refreshAccessToken,
  registerWithCredentials,
  resetPassword,
  signInWithCredentials,
  signOutToken,
} from '../auth';

const userCredentials: Credentials = {
  email: 'example@example.com',
  password: 'password',
};

const user: User = {
  id: 0,
  email: userCredentials.email,
  password: bcrypt.hashSync(userCredentials.password, 10),
  role: 'user',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const tokensSchema = z.object({
  token: jsonWebTokenSchema,
  refreshToken: jsonWebTokenSchema,
});

describe('registerWithCredentials', () => {
  registerWithCredentials;

  it('should throw error if already user exists', async () => {
    dbMock.user.findUnique.mockResolvedValue(user);

    expect(
      registerWithCredentials(userCredentials, {rememberMe: false})
    ).rejects.toThrow('User already exists');
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

    const tokens = await registerWithCredentials(userCredentials, {
      rememberMe: false,
    });

    expect(tokensSchema.parse(tokens)).toBeTruthy();
  });
});

describe('signInWithCredentials', () => {
  signInWithCredentials;

  it('throws error if user does not exist', () => {
    dbMock.user.findUnique.mockResolvedValue(null);
    expect(
      signInWithCredentials(userCredentials, {rememberMe: false})
    ).rejects.toThrow('User not found');
  });

  it('throws error if user exists with incorrect credentials', () => {
    dbMock.user.findUnique.mockResolvedValue(user);
    expect(
      signInWithCredentials(
        {...userCredentials, password: 'incorrect-password'},
        {rememberMe: false}
      )
    ).rejects.toThrow('Wrong password');
  });

  it('returns tokens if user exists with correct credentials', async () => {
    dbMock.user.findUnique.mockResolvedValue(user);
    dbMock.token.findUnique.mockResolvedValue({} as Token);

    const tokens = await signInWithCredentials(userCredentials, {
      rememberMe: false,
    });

    expect(tokensSchema.parse(tokens)).toBeTruthy();
  });
});

describe('deleteExpiredTokens', () => {
  deleteExpiredTokens;

  it('deletes expired tokens', async () => {
    await deleteExpiredTokens();

    expect(dbMock.token.deleteMany).toBeCalled();
    expect(dbMock.refreshToken.deleteMany).toBeCalled();
  });
});

describe('getSessionFromToken', () => {
  getSessionFromToken;

  it('throws error if token is invalid', () => {
    expect(getSessionFromToken('invalid-token')).rejects.toThrow(
      'Malformed token'
    );
  });

  it('returns token if it is valid', async () => {
    const validToken = await TokenRegistry.createTokenForUser(user);
    const session = await getSessionFromToken(validToken);
    expect(jsonWebTokenPayloadSchema.parse(session)).toBeTruthy();
  });
});

describe('refreshAccessToken', () => {
  refreshAccessToken;

  let token: string;
  let refreshToken: string;

  beforeAll(async () => {
    dbMock.token.findUnique.mockResolvedValue({} as Token);
    token = await TokenRegistry.createTokenForUser(user);
    refreshToken = await RefreshTokenRegistry.createRefreshTokenForToken(token);
  });

  it('throws error if access token is invalid', () => {
    expect(refreshAccessToken('invalid-token', refreshToken)).rejects.toThrow(
      'Malformed token'
    );
  });

  it('throws error if refresh token is invalid', () => {
    expect(refreshAccessToken(token, 'invalid-token')).rejects.toThrow(
      'Malformed refresh token'
    );
  });

  it('returns tokens if success', async () => {
    dbMock.user.findUnique.mockResolvedValue(user);
    dbMock.token.findUnique.mockResolvedValue({id: 'id'} as Token);
    dbMock.refreshToken.findUnique.mockResolvedValue({} as RefreshToken);

    const tokens = await refreshAccessToken(token, refreshToken);

    expect(tokensSchema.parse(tokens)).toBeTruthy();
    expect(dbMock.token.update).toBeCalled();
    expect(dbMock.refreshToken.create).toBeCalled();
  });
});

describe('resetPassword', () => {
  resetPassword;

  it('throws error if user does not exist', () => {
    dbMock.user.findUnique.mockResolvedValue(null);
    expect(
      resetPassword({...userCredentials, newPassword: 'new-password'})
    ).rejects.toThrow('User not found');
  });

  it('throws error if wrong password is supplied', () => {
    dbMock.user.findUnique.mockResolvedValue(user);
    expect(
      resetPassword({
        ...userCredentials,
        password: 'incorrect-password',
        newPassword: 'new-password',
      })
    ).rejects.toThrow('Wrong old password');
  });

  it('updates user password with new password if success', async () => {
    dbMock.user.findUnique.mockResolvedValue(user);

    await resetPassword({
      ...userCredentials,
      newPassword: 'new-password',
    });

    expect(dbMock.user.update).toBeCalled();
  });
});

describe('signOutToken', () => {
  signOutToken;
  it.todo('deletes refresh token associated with the token');
  it.todo('deletes the token');
});
