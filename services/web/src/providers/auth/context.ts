import {createContext} from 'react';
import type {
  Credentials,
  DecodedJsonWebToken,
} from '~/redux/services/types/auth';

export const AuthContext = createContext<{
  login: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (credentials: Credentials) => Promise<void>;
  getSession: () => Promise<void>;
  session: DecodedJsonWebToken | null;
  token: string | null;
  refreshToken: string | null;
}>({
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  getSession: () => Promise.resolve(),
  session: null,
  token: null,
  refreshToken: null,
});
