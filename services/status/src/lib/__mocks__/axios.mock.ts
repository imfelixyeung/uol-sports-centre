// modified from https://www.prisma.io/docs/guides/testing/unit-testing#singleton

// eslint-disable-next-line node/no-unpublished-import
import {DeepMockProxy, mockDeep, mockReset} from 'jest-mock-extended';

import axios, {Axios} from 'axios';

// mocks prisma
jest.mock('axios', () => ({
  __esModule: true,
  default: mockDeep<Axios>(),
}));

beforeEach(() => {
  mockReset(axiosMock);
});

export const axiosMock = axios as unknown as DeepMockProxy<Axios>;
