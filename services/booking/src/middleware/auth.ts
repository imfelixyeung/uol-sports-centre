import {type Response, type NextFunction} from 'express';
import {type Params, type Request} from 'express-jwt';

import {env} from '@/env/index';

export const jwtArgs: Params = {
  secret: env.JWT_SIGNING_SECRET,
  algorithms: ['HS256'],
  issuer: 'auth',
};

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.auth && req.auth.role === 'admin') {
    next();
  } else {
    res.status(403).send({status: 'error', message: 'Forbidden'});
  }
};
