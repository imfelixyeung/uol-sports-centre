// ignore specific log levels in unit tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};
