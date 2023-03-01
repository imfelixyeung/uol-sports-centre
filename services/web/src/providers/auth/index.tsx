import {FC, PropsWithChildren, useEffect} from 'react';
import {
  useGetSessionQuery,
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useRegisterMutation,
} from '~/redux/services/api';
import {
  Credentials,
  DecodedJsonWebToken,
  Tokens,
} from '~/redux/services/types/auth';
import {AuthContext} from './context';
import {useStorage} from './hooks/useStorage';
import dayjs from 'dayjs';
import jwt_decode from 'jwt-decode';

useLoginMutation;
useLogoutMutation;
useRegisterMutation;
useGetSessionQuery;
useRefreshTokenMutation;

export const AuthProvider: FC<PropsWithChildren> = ({children}) => {
  const [token, setToken] = useStorage<string | null>('accessToken');
  const [refreshToken, setRefreshToken] = useStorage<string | null>(
    'refreshToken'
  );
  const [session, setSession] = useStorage<DecodedJsonWebToken | null>(
    'session'
  );

  const [loginMutation, loginMutationData] = useLoginMutation();
  const [logoutMutation, logoutMutationData] = useLogoutMutation();
  const [registerMutation, registerMutationData] = useRegisterMutation();
  const [refreshTokenMutation, refreshTokenMutationData] =
    useRefreshTokenMutation();
  const sessionData = useGetSessionQuery({token: token ?? ''}, {skip: !token});

  const saveTokens = (tokens: Tokens) => {
    setToken(tokens.token);
    setRefreshToken(tokens.refreshToken);
  };

  const login = async (credentials: Credentials) => {
    const data = await loginMutation(credentials)
      .unwrap()
      .catch(error => {
        // TODO: Handle error
        throw error;
      });

    saveTokens(data.data);
  };

  const logout = async () => {
    if (!token) return;
    await logoutMutation({token}).unwrap();
    clear();
  };

  const register = async (credentials: Credentials) => {
    const data = await registerMutation(credentials)
      .unwrap()
      .catch(error => {
        // TODO: Handle error
        throw error;
      });

    saveTokens(data.data);
  };

  const getSession = async () => {
    const test = sessionData.refetch().unwrap();
  };

  useEffect(() => {
    if (!sessionData.data) return;
    if (!sessionData.data.success) return;
    if (!token || !refreshToken) return;

    setSession(sessionData.data.data);
  }, [sessionData.data]);

  const clear = () => {
    console.debug('Clearing tokens and session...');
    setToken(null);
    setRefreshToken(null);
    setSession(null);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!token) return;
      if (!refreshToken) return;
      // periodically check if the token should be refreshed
      if (refreshTokenMutationData.isLoading) return;
      const decoded = jwt_decode(token);

      if (!decoded) {
        console.debug('Unable to decode JWT, clearing...');
        return clear();
      }

      const exp = (decoded as any).exp;

      const expiration = dayjs(exp * 1000);
      console.debug(expiration.subtract(1, 'minute').toDate().toLocaleString());
      if (expiration.subtract(1, 'minute').isAfter(dayjs())) return;

      // refresh token
      console.debug('Refreshing token...');
      refreshTokenMutation({token, refreshToken})
        .unwrap()
        .then(data => {
          // token refreshed, save new tokens
          saveTokens(data.data);
        })
        .catch(error => {
          // something went wrong, clear everything
          console.debug('Error refreshing token', error);
          clear();
        });
    }, 500);
    return () => clearInterval(interval);
  }, [token, refreshToken, refreshTokenMutationData.isLoading]);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        register,
        getSession,
        token,
        refreshToken,
        session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
