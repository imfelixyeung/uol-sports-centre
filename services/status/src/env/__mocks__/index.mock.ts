// mocks env variables
jest.mock('..', () => ({
  _esModule: true,
  env: {
    PORT: 80,
    HOST: '0.0.0.0',
  },
}));
