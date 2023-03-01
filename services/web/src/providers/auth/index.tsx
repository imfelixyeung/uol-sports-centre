import {FC, PropsWithChildren} from 'react';
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
  const sessionData = useGetSessionQuery();

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
    await logoutMutation().unwrap();
    setToken(null);
    setRefreshToken(null);
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

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        register,
        getSession,
        session,
        token,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
