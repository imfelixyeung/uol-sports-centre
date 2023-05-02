import bcrypt from 'bcrypt';
import {RefreshTokenRegistry} from '~/persistence/refresh-tokens';
import {TokenRegistry} from '~/persistence/tokens';
import {UserRegistry} from '~/persistence/users';
import {Credentials, ResetPassword} from '~/schema/credentials';
import {JsonWebToken} from '~/schema/jwt';

/**
 * signs a user in with their credentials
 * @param credentials email password
 * @returns jwt token and refresh token
 */
export const signInWithCredentials = async (
  credentials: Credentials,
  options: {rememberMe: boolean}
) => {
  const {email, password} = credentials;
  const {rememberMe} = options;

  const user = await UserRegistry.getUserByEmail(email.toLowerCase());

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
    token,
    {shortLived: !rememberMe}
  );

  return {token, refreshToken};
};

/**
 * registers a user with their credentials
 * @param credentials email password
 * @returns jwt token and refresh token
 */
export const registerWithCredentials = async (
  credentials: Credentials,
  options: {rememberMe: boolean}
) => {
  const {email, password} = credentials;
  const {rememberMe} = options;

  const user = await UserRegistry.getUserByEmail(email.toLowerCase());

  if (user) {
    // user already exists
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // create user
  const newUser = await UserRegistry.createUser({
    email: email.toLowerCase(),
    password: hashedPassword,
  });

  // success, create token
  const token = await TokenRegistry.createTokenForUser(newUser);
  const refreshToken = await RefreshTokenRegistry.createRefreshTokenForToken(
    token,
    {shortLived: !rememberMe}
  );
  return {token, refreshToken};
};

/**
 * resets a user's password
 * @param options old credentials and new password
 */
export const resetPassword = async (options: ResetPassword) => {
  const {email, password, newPassword} = options;

  const user = await UserRegistry.getUserByEmail(email.toLowerCase());

  if (!user) {
    // user not found
    throw new Error('User not found');
  }

  const hashedPassword = user.password;

  const match = await bcrypt.compare(password, hashedPassword);

  if (!match) {
    // wrong password
    throw new Error('Wrong old password');
  }

  const newHashedPassword = await bcrypt.hash(newPassword, 10);

  // update user
  await UserRegistry.updatePassword(user.id, newHashedPassword);
};

/**
 * gets the jwt payload from a token, throws error if malformed
 * @param token jwt token
 * @returns session (decoded jwt payload)
 */
export const getSessionFromToken = async (token: JsonWebToken) => {
  try {
    const decoded = await TokenRegistry.verifyToken(token);
    return decoded;
  } catch (error) {
    throw new Error('Malformed token');
  }
};

/**
 * signs a user out by invalidating all tokens associated with the token
 * @param token jwt token
 */
export const signOutToken = async (token: JsonWebToken) => {
  await TokenRegistry.invalidateToken(token);
};

/**
 * refreshes an access token and refresh token
 * @param token jwt token
 * @param refreshToken  jwt refresh token
 * @returns refreshed token and refresh token
 */
export const refreshAccessToken = async (
  token: JsonWebToken,
  refreshToken: string
) => {
  await TokenRegistry.verifyToken(token);
  await RefreshTokenRegistry.verifyRefreshToken(refreshToken);

  // success, create tokens
  const newToken = await TokenRegistry.renewToken(token);
  const newRefreshToken = await RefreshTokenRegistry.createRefreshTokenForToken(
    token
  );

  return {token: newToken, refreshToken: newRefreshToken};
};

/**
 * Deletes all expired access tokens and refresh tokens
 */
export const deleteExpiredTokens = async () => {
  // cascading delete
  try {
    await RefreshTokenRegistry.deleteExpiredRefreshTokens();
    await TokenRegistry.deleteExpiredTokens();
  } catch (error) {
    console.error('Something went wrong while deleting expired tokens', error);
  }
};
