// mocks env variables
jest.mock('..', () => ({
  _esModule: true,
  env: {
    PORT: 80,
    HOST: '0.0.0.0',
    JWT_SIGNING_SECRET: 'auth-ci__access',
    JWT_REFRESH_SIGNING_SECRET: 'auth-ci__refresh',
  },
}));
