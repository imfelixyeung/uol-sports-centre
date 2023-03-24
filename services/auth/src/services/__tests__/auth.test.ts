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
  role: 'USER',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// schema to later validate the tokens returned by the functions are valid
const tokensSchema = z.object({
  token: jsonWebTokenSchema,
  refreshToken: jsonWebTokenSchema,
});

describe('registerWithCredentials', () => {
  registerWithCredentials;

  it('should throw error if already user exists', async () => {
    // mock the resolved value to return a user
    dbMock.user.findUnique.mockResolvedValue(user);

    // the function should reject with a meaningful error message
    expect(
      registerWithCredentials(userCredentials, {rememberMe: false})
    ).rejects.toThrow('User already exists');
  });

  it('should return tokens when user is new', async () => {
    // mock the user creation to be successfull
    dbMock.user.create.mockResolvedValue(user);

    // mock the token creation to be successfull
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

    // checks if the return value matches the defined schema
    expect(tokensSchema.parse(tokens)).toBeTruthy();
  });
});

describe('signInWithCredentials', () => {
  signInWithCredentials;

  it('throws error if user does not exist', () => {
    // mock the database to return null user
    dbMock.user.findUnique.mockResolvedValue(null);

    // the function should reject with a meaningful error message
    expect(
      signInWithCredentials(userCredentials, {rememberMe: false})
    ).rejects.toThrow('User not found');
  });

  it('throws error if user exists with incorrect credentials', () => {
    // mock the database to return a user
    dbMock.user.findUnique.mockResolvedValue(user);

    // when an incorrect password is supplied,
    // the function should reject with a meaningful error message
    expect(
      signInWithCredentials(
        {...userCredentials, password: 'incorrect-password'},
        {rememberMe: false}
      )
    ).rejects.toThrow('Wrong password');
  });

  it('returns tokens if user exists with correct credentials', async () => {
    // mock the database to return a user
    dbMock.user.findUnique.mockResolvedValue(user);

    // mock the token creation to be successfull
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

    // the function should call deleteMany on tokens and refreshTokens
    expect(dbMock.token.deleteMany).toBeCalled();
    expect(dbMock.refreshToken.deleteMany).toBeCalled();
  });
});

describe('getSessionFromToken', () => {
  getSessionFromToken;

  it('throws error if token is invalid', () => {
    // when the token is invalid, eg. expired or malformed/tampered with,
    // the function should reject with a meaningful error message
    expect(getSessionFromToken('invalid-token')).rejects.toThrow(
      'Malformed token'
    );
  });

  it('returns token if it is valid', async () => {
    // creating a temporary valid token for the test
    const validToken = await TokenRegistry.createTokenForUser(user);
    const session = await getSessionFromToken(validToken);

    // we expect the parsing to succeed without throwing an error
    expect(jsonWebTokenPayloadSchema.parse(session)).toBeTruthy();
  });
});

describe('refreshAccessToken', () => {
  refreshAccessToken;

  let token: string;
  let refreshToken: string;

  beforeAll(async () => {
    // always mock the database to return a token,
    // and create temporary tokens for testing
    dbMock.token.findUnique.mockResolvedValue({} as Token);
    token = await TokenRegistry.createTokenForUser(user);
    refreshToken = await RefreshTokenRegistry.createRefreshTokenForToken(token);
  });

  it('throws error if access token is invalid', () => {
    // an invalid token paired with a valid refresh token should throw an error
    expect(refreshAccessToken('invalid-token', refreshToken)).rejects.toThrow(
      'Malformed token'
    );
  });

  it('throws error if refresh token is invalid', () => {
    // a valid token paired with an invalid refresh token should throw an error
    expect(refreshAccessToken(token, 'invalid-token')).rejects.toThrow(
      'Malformed refresh token'
    );
  });

  it('returns tokens if success', async () => {
    // mock the database to return a user, a token, and a refresh token
    dbMock.user.findUnique.mockResolvedValue(user);
    dbMock.token.findUnique.mockResolvedValue({id: 'id'} as Token);
    dbMock.refreshToken.findUnique.mockResolvedValue({} as RefreshToken);

    const tokens = await refreshAccessToken(token, refreshToken);

    // expect the tokens to be parsed successfully without throwing errors
    expect(tokensSchema.parse(tokens)).toBeTruthy();

    // checks if the correct db functions are called
    expect(dbMock.token.update).toBeCalled();
    expect(dbMock.refreshToken.create).toBeCalled();
  });
});

describe('resetPassword', () => {
  resetPassword;

  it('throws error if user does not exist', () => {
    // mock the database to return null user
    dbMock.user.findUnique.mockResolvedValue(null);

    // the function should reject with a meaningful error message
    expect(
      resetPassword({...userCredentials, newPassword: 'new-password'})
    ).rejects.toThrow('User not found');
  });

  it('throws error if wrong password is supplied', () => {
    // mock the database to return a user
    dbMock.user.findUnique.mockResolvedValue(user);

    // when an incorrect password is supplied,
    // the function should reject with a meaningful error message
    expect(
      resetPassword({
        ...userCredentials,
        password: 'incorrect-password',
        newPassword: 'new-password',
      })
    ).rejects.toThrow('Wrong old password');
  });

  it('updates user password with new password if success', async () => {
    // mock the database to return a user
    dbMock.user.findUnique.mockResolvedValue(user);

    // when correct old password is supplied,
    // the function should update the user password
    await resetPassword({
      ...userCredentials,
      newPassword: 'new-password',
    });

    // checks if the correct db functions are called
    expect(dbMock.user.update).toBeCalled();
  });
});

describe('signOutToken', () => {
  signOutToken;
  // when mocking the transaction callback
  // the actual transaction (tx) type and the prisma client (db) type is similar,
  // used interchangeably for ease of testing

  it('throws error if the token is not found', async () => {
    // mocks the transaction function
    dbMock.$transaction.mockImplementation(cb => cb(dbMock));

    // mocks the token to be null
    dbMock.token.findUnique.mockResolvedValue(null);

    const validToken = await TokenRegistry.createTokenForUser(user);

    // function should reject with a meaningful error message
    expect(signOutToken(validToken)).rejects.toThrow('Token not found');
  });

  it('deletes refresh token associated with the token', async () => {
    // mocks the transaction function
    dbMock.$transaction.mockImplementation(cb => cb(dbMock));
    // mocks the token to be found, where the refreshToken associated is not null
    dbMock.token.findUnique.mockResolvedValue({
      refreshTokens: {},
    } as unknown as Token);

    const validToken = await TokenRegistry.createTokenForUser(user);
    await signOutToken(validToken);

    // checks if the update function is called and deletes the refreshToken
    expect(dbMock.token.update).toBeCalledWith(
      expect.objectContaining({
        data: {
          refreshTokens: {delete: true},
        },
      })
    );
  });

  it('deletes the token', async () => {
    // mocks the transaction function
    dbMock.$transaction.mockImplementation(callback => callback(dbMock));
    // mocks the token to be found, where the refreshToken associated is not null
    dbMock.token.findUnique.mockResolvedValue({
      refreshTokens: {},
    } as unknown as Token);

    const validToken = await TokenRegistry.createTokenForUser(user);
    await signOutToken(validToken);

    // expects the delete function to be called and deletes the correct token
    expect(dbMock.token.delete).toBeCalledWith({where: {token: validToken}});
  });
});
