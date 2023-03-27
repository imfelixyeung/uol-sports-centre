import {Request} from 'express';
import {JsonWebToken, jsonWebTokenSchema} from '../schema/jwt';
import jwt from 'jsonwebtoken';

export const getJwtFromRequest = (req: Request) => {
  const authorisation = req.headers.authorization;
  if (!authorisation) return null;

  if (!authorisation.startsWith('Bearer ')) return null;
  const token = authorisation.split('Bearer ')[1];

  const parsedTokenData = jsonWebTokenSchema.safeParse(token);
  if (!parsedTokenData.success) return null;

  const jwtPayload = jwt.decode(token);
  if (!jwtPayload) return null;

  const decodedTokenData = Object.assign({}, parsedTokenData.data, jwtPayload);

  return decodedTokenData as JsonWebToken;
};
