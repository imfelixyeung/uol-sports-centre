import {Request} from 'express';
import {getJwtFromRequest} from '../getJwtFromRequest';

describe('getJwtFromRequest', () => {
  it('should return null when no auth header is provided', () => {
    const request = {headers: {}} as Request;
    expect(getJwtFromRequest(request)).toBeNull();
  });

  it('should return null when an invalid auth header is provided', () => {
    const token = 'token';
    const request = {
      headers: {
        authorization: `JWT ${token}`,
      },
    } as Request;
    expect(getJwtFromRequest(request)).toBeNull();
  });

  it('should return jwt when have a valid auth header is provided', () => {
    const token = 'eyToken.token.token';
    const request = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as Request;
    expect(getJwtFromRequest(request)).toBe(token);
  });
});
