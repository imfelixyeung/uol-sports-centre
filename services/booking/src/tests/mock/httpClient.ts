import {IHttpClient} from '@/lib/httpClient';
import {mockDeep, DeepMockProxy} from 'jest-mock-extended';
import httpClient from '@/lib/httpClient';

jest.mock('@/lib/httpClient', () => ({
  __esModule: true,
  default: mockDeep<IHttpClient>(),
}));

export const httpClientMock =
  httpClient as unknown as DeepMockProxy<IHttpClient>;
