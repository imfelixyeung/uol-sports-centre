import {type Response, type NextFunction} from 'express';
import {type Params, type Request} from 'express-jwt';

import {env} from '@/env/index';
import logger from '@/lib/logger';

export const jwtArgs: Params = {
  secret: env.JWT_SIGNING_SECRET,
  algorithms: ['HS256'],
  issuer: 'auth',
};

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  EMPLOYEE = 'EMPLOYEE',
}

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.auth && req.auth.user.role === UserRole.ADMIN) {
    next();
  } else {
    logger.debug('Access denied for user', req.auth?.user.id, 'to', req.path);
    res.status(403).send({status: 'error', message: 'Forbidden'});
  }
};
