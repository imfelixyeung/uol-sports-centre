import {Request} from 'express';
import {JsonWebToken, jsonWebTokenSchema} from '../schema/jwt';
import jwt from 'jsonwebtoken';

export const getJwtFromRequest = (req: Request) => {
  const authorization = req.headers.authorization;
  if (!authorization) return null;

  if (!authorization.startsWith('Bearer ')) return null;
  const token = authorization.split('Bearer ')[1];

  const parsedTokenData = jsonWebTokenSchema.safeParse(token);
  if (!parsedTokenData.success) return null;

  const jwtPayload = jwt.decode(token);
  if (!jwtPayload) return null;

  const decodedTokenData = Object.assign({}, parsedTokenData.data, jwtPayload);

  return decodedTokenData as JsonWebToken;
};
