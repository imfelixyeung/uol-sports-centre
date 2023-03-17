import {dbMock} from '~/utils/__mocks__/db.mock';

import {getDatabaseHealth, getHealth} from '../health';

describe('getHealth', () => {
  it('should be healthy if all services are healthy', () => {
    dbMock.$queryRaw.mockResolvedValue('something');
    expect(getHealth()).resolves.toHaveProperty('healthy', true);
  });
  it('should not be healthy if any service is not healthy', () => {
    dbMock.$queryRaw.mockRejectedValue('error');
    expect(getHealth()).resolves.toHaveProperty('healthy', false);
  });
});

describe('getDatabaseHealth', () => {
  it('should return true if prisma returns something', () => {
    dbMock.$queryRaw.mockResolvedValue('something');
    expect(getDatabaseHealth()).resolves.toBe(true);
  });

  it('should return false if prisma throws an error', () => {
    dbMock.$queryRaw.mockRejectedValue('error');
    expect(getDatabaseHealth()).resolves.toBe(false);
  });
});
