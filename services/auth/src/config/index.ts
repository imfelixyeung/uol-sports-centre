import jwt from 'jsonwebtoken';
import ms from 'ms';
export {UserRole} from '@prisma/client';

const ACCESS_JWT_EXPIRES_IN = '15m';
const SHORT_REFRESH_JWT_EXPIRES_IN = '24h';
const LONG_REFRESH_JWT_EXPIRES_IN = '30d';

export const ACCESS_JWT_EXPIRES_IN_MS = ms(ACCESS_JWT_EXPIRES_IN);
export const SHORT_REFRESH_JWT_EXPIRES_IN_MS = ms(SHORT_REFRESH_JWT_EXPIRES_IN);
export const LONG_REFRESH_JWT_EXPIRES_IN_MS = ms(LONG_REFRESH_JWT_EXPIRES_IN);

export const JWT_SIGN_OPTIONS: jwt.SignOptions = {
  algorithm: 'HS256',
  issuer: 'auth',
};

export const ACCESS_JWT_SIGN_OPTIONS: jwt.SignOptions = {
  ...JWT_SIGN_OPTIONS,
  expiresIn: ACCESS_JWT_EXPIRES_IN,
};

export const REFRESH_JWT_SIGN_OPTIONS: jwt.SignOptions = {
  ...JWT_SIGN_OPTIONS,
};
