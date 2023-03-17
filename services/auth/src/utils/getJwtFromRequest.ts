import {Request} from 'express';
import {JsonWebToken, jsonWebTokenSchema} from '~/schema/jwt';

export const getJwtFromRequest = (req: Request) => {
  const authorisation = req.headers.authorization;
  if (!authorisation) return null;

  if (!authorisation.startsWith('Bearer ')) return null;
  const token = authorisation.split('Bearer ')[1];

  const parsedTokenData = jsonWebTokenSchema.safeParse(token);
  if (!parsedTokenData.success) return null;

  return parsedTokenData.data as JsonWebToken;
};
