import jwt from 'jsonwebtoken';
import {Credentials} from '../schema/credentials';
import {JsonWebToken} from '../schema/jwt';
import bcrypt from 'bcrypt';
import {env} from '../env';
import {User} from '@prisma/client';
import {randomUUID} from 'crypto';
import {UserRegistry} from '../persistence/users';

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
  const token = createTokenFromUser(user);
  return token;
};

export const registerWithCredentials = async (credentials: Credentials) => {
  const {email, password} = credentials;

  const user = await UserRegistry.getUserByEmail(email);

  if (user) {
    // user already exists
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // create user
  const newUser = await UserRegistry.createUser({
    email,
    password: hashedPassword,
  });

  // success, create token
  const token = createTokenFromUser(newUser);
  return token;
};

export const getSessionFromToken = async (token: JsonWebToken) => {
  try {
    const decoded = jwt.verify(token, env.JWT_SIGNING_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Malformed token');
  }
};

export const signOutToken = async (token: JsonWebToken) => {
  // todo: invalidate refresh tokens associated with this token
  return null;
};

const createTokenFromUser = (user: User) => {
  const token = jwt.sign({email: user.email}, env.JWT_SIGNING_SECRET, {
    subject: user.id,
    algorithm: 'HS256',
    expiresIn: '1d',
    issuer: 'auth',
    jwtid: randomUUID(),
  });

  return token;
};
