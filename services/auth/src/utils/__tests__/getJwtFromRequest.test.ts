import {Request} from 'express';
import {getJwtFromRequest} from '../getJwtFromRequest';

describe('getJwtFromRequest', () => {
  it('should return null when no auth header is provided', () => {
    const request = {headers: {}} as Request;
    expect(getJwtFromRequest(request)).toBeNull();
  });

  it('should return null when an invalid auth header is provided', () => {
    const token = 'header.payload.signature';
    const request = {
      headers: {
        authorization: `JWT ${token}`,
      },
    } as Request;
    expect(getJwtFromRequest(request)).toBeNull();
  });

  it('should return null when an jwt without 3 parts is provided', () => {
    const token = 'header.payload.signature.somethingelse';
    const request = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as Request;
    expect(getJwtFromRequest(request)).toBeNull();
  });

  it('should return jwt when have a valid auth header is provided', () => {
    const token = 'header.payload.signature';
    const request = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as Request;
    expect(getJwtFromRequest(request)).toBe(token);
  });
});
