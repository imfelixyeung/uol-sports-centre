import jwt from 'jsonwebtoken';
import ms from 'ms';

const ACCESS_JWT_EXPIRES_IN = '15m';
const REFRESH_JWT_EXPIRES_IN = '24h';
export const ACCESS_JWT_EXPIRES_IN_MS = ms(ACCESS_JWT_EXPIRES_IN);
export const REFRESH_JWT_EXPIRES_IN_MS = ms(REFRESH_JWT_EXPIRES_IN);

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
  expiresIn: REFRESH_JWT_EXPIRES_IN,
};
