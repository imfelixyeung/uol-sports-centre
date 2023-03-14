import dayjs from 'dayjs';
import jwt_decode from 'jwt-decode';
import {useRouter} from 'next/router';
import type {FC, PropsWithChildren} from 'react';
import {useCallback, useEffect} from 'react';
import {
  useGetSessionQuery,
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useRegisterMutation,
} from '~/redux/services/api';
import type {
  Credentials,
  DecodedJsonWebToken,
  Tokens,
} from '~/redux/services/types/auth';
import {AuthContext} from './context';
import {useAuth} from './hooks/useAuth';
import {useStorage} from './hooks/useStorage';

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

  const [loginMutation] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();
  const [registerMutation] = useRegisterMutation();
  const [refreshTokenMutation, refreshTokenMutationData] =
    useRefreshTokenMutation();
  const sessionData = useGetSessionQuery({token: token ?? ''}, {skip: !token});

  const saveTokens = useCallback(
    (tokens: Tokens) => {
      setToken(tokens.token);
      setRefreshToken(tokens.refreshToken);
    },
    [setRefreshToken, setToken]
  );

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
    const data = await registerMutation({...credentials})
      .unwrap()
      .catch(error => {
        // TODO: Handle error
        throw error;
      });

    saveTokens(data.data);
  };

  const getSession = async () => {
    await sessionData.refetch().unwrap();
  };

  useEffect(() => {
    if (!sessionData.data) return;
    if (!sessionData.data.success) return;
    if (!token || !refreshToken) return;

    setSession(sessionData.data.data);
  }, [sessionData.data, refreshToken, token, setSession]);

  const clear = useCallback(() => {
    console.debug('Clearing tokens and session...');
    setToken(null);
    setRefreshToken(null);
    setSession(null);
  }, [setRefreshToken, setSession, setToken]);

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

      const exp = (
        decoded as {
          exp: number;
        }
      ).exp;

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
  }, [
    token,
    refreshToken,
    refreshTokenMutationData.isLoading,
    clear,
    refreshTokenMutation,
    saveTokens,
  ]);

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

export const PageAuthRequired: FC<PropsWithChildren> = ({children}) => {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (auth.session) return;

      const path = router.asPath;

      void router.push(`/auth/login?redirect=${path}`);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [auth.session, router]);

  if (!auth.session) return <></>;
  return <>{children}</>;
};

// function inspired by auth0 nextjs's withPageAuthRequired function
export const withPageAuthRequired = <T extends {} = {}>(Page: FC<T>): FC<T> => {
  const WithPageAuthRequired = (props: T) => {
    return (
      <PageAuthRequired>
        <Page {...props} />
      </PageAuthRequired>
    );
  };

  return WithPageAuthRequired;
};
