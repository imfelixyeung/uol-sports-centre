// modified from https://www.prisma.io/docs/guides/testing/unit-testing#singleton

import {PrismaClient} from '@prisma/client';
// eslint-disable-next-line node/no-unpublished-import
import {DeepMockProxy, mockDeep, mockReset} from 'jest-mock-extended';
import {db} from '../db';

// mocks prisma
jest.mock('../db', () => ({
  __esModule: true,
  db: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(dbMock);
});

export const dbMock = db as unknown as DeepMockProxy<PrismaClient>;
