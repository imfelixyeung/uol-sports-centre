import {Request} from 'express';
import {jsonWebTokenSchema} from '../schema/jwt';
import jwt from 'jsonwebtoken';
import {z} from 'zod';
import {env} from '../env';

export const getJwtFromRequest = (req: Request) => {
  const authorization = req.headers.authorization;
  if (!authorization) return null;

  if (!authorization.startsWith('Bearer ')) return null;
  const token = authorization.split('Bearer ')[1];

  if (!token) return null;

  try {
    const decodedToken = jwt.verify(token, env.JWT_SIGNING_SECRET);
    if (!decodedToken) return null;
  } catch (error) {
    return null;
  }

  const parsedTokenData = jsonWebTokenSchema.safeParse(token);
  if (!parsedTokenData.success) return null;

  const jwtPayload = jwt.decode(token);
  if (!jwtPayload) return null;

  // Define scheme for decoded token data

  const schema = z.object({
    user: z.object({
      id: z.coerce.number(),
      email: z.string(),
      role: z.string(),
    }),
    type: z.string(),
    iat: z.number(),
    exp: z.number(),
    iss: z.string(),
    sub: z.string(),
    jti: z.string(),
  });

  const extractedData = schema.safeParse(jwtPayload);
  if (!extractedData.success) return null;

  return extractedData.data.user;
};
