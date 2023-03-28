import jwt from 'jsonwebtoken';

import {env} from '@/env';
import {UserRole} from '@/middleware/auth';
import {PrismaClient} from '@prisma/client';

export const prisma = new PrismaClient();
export const BASE_URL = 'http://gateway/api/booking';

const token_options: jwt.SignOptions = {
  algorithm: 'HS256',
  issuer: 'auth',
};

export const USER_TOKEN = jwt.sign(
  {
    user: {
      id: 1,
      email: 'test@test.com',
      role: UserRole.USER,
    },
    type: 'access',
  },
  env.JWT_SIGNING_SECRET,
  token_options
);

export const EMPLOYEE_TOKEN = jwt.sign(
  {
    user: {
      id: 5,
      email: 'employee@test.com',
      role: UserRole.EMPLOYEE,
    },
    type: 'access',
  },
  env.JWT_SIGNING_SECRET,
  token_options
);

export const ADMIN_TOKEN = jwt.sign(
  {
    user: {
      id: 2,
      email: 'admin@test.com',
      role: UserRole.ADMIN,
    },
    type: 'access',
  },
  env.JWT_SIGNING_SECRET,
  token_options
);
