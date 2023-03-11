// modified from https://www.prisma.io/docs/guides/testing/unit-testing#singleton

import {PrismaClient} from '@prisma/client';
// eslint-disable-next-line node/no-unpublished-import
import {DeepMockProxy, mockDeep, mockReset} from 'jest-mock-extended';

import {db} from './utils/db';

// mocks prisma
jest.mock('./utils/db', () => ({
  __esModule: true,
  db: mockDeep<PrismaClient>(),
}));

// mocks env variables
jest.mock('./env', () => ({
  _esModule: true,
  env: {
    PORT: 80,
    HOST: '0.0.0.0',
    JWT_SIGNING_SECRET: 'auth-ci__access',
    JWT_REFRESH_SIGNING_SECRET: 'auth-ci__refresh',
  },
}));

beforeEach(() => {
  mockReset(dbMock);
});

export const dbMock = db as unknown as DeepMockProxy<PrismaClient>;
