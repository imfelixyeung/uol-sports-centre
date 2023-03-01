import {Credentials, Name} from '../schema/credentials';
import {JsonWebToken} from '../schema/jwt';
import bcrypt from 'bcrypt';
import {UserRegistry} from '../persistence/users';
import {TokenRegistry} from '../persistence/tokens';
import {RefreshTokenRegistry} from '../persistence/refresh-tokens';

export const signInWithCredentials = async (credentials: Credentials) => {
  const {email, password} = credentials;

  const user = await UserRegistry.getUserByEmail(email);

  if (!user) {
    // user not found
    throw new Error('User not found');
  }

  const hashedPassword = user.password;

  const match = await bcrypt.compare(password, hashedPassword);

  if (!match) {
    // wrong password
    throw new Error('Wrong password');
  }

  // success, create token
  const token = await TokenRegistry.createTokenForUser(user);
  const refreshToken = await RefreshTokenRegistry.createRefreshTokenForToken(
    token
  );

  return {token, refreshToken};
};

export const registerWithCredentials = async (
  credentials: Credentials,
  name: Name
) => {
  const {email, password} = credentials;

  const user = await UserRegistry.getUserByEmail(email);

  if (user) {
    // user already exists
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // create user
  const newUser = await UserRegistry.createUser(
    {email, password: hashedPassword},
    name
  );

  // success, create token
  const token = await TokenRegistry.createTokenForUser(newUser);
  const refreshToken = await RefreshTokenRegistry.createRefreshTokenForToken(
    token
  );
  return {token, refreshToken};
};

export const getSessionFromToken = async (token: JsonWebToken) => {
  try {
    const decoded = TokenRegistry.verifyToken(token);
    return decoded;
  } catch (error) {
    throw new Error('Malformed token');
  }
};

export const signOutToken = async (token: JsonWebToken) => {
  await TokenRegistry.invalidateToken(token);
};

export const refreshAccessToken = async (
  token: string,
  refreshToken: string
) => {
  const verified = !!(
    (await TokenRegistry.verifyToken(token)) &&
    (await RefreshTokenRegistry.verifyRefreshToken(refreshToken))
  );

  if (!verified) {
    throw new Error('Malformed token or refresh token');
  }

  // success, create tokens
  const newToken = await TokenRegistry.renewToken(token);
  const newRefreshToken = await RefreshTokenRegistry.createRefreshTokenForToken(
    token
  );

  return {token: newToken, refreshToken: newRefreshToken};
};
