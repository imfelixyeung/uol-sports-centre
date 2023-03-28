import {Request} from 'express';
import {JsonWebToken, jsonWebTokenSchema} from '../schema/jwt';
import jwt from 'jsonwebtoken';
import {z} from 'zod';

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

  // Define scheme for decoded token data
  const schema = z.object({
    id: z.coerce.number(),
    role: z.string(),
  });

  const extractedData = schema.safeParse(
    JSON.parse(decodedTokenData as JsonWebToken)
  );
  if (!extractedData.success) return null;

  return extractedData.data;
};
