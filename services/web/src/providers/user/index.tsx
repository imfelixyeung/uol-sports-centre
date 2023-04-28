import {useRouter} from 'next/router';
import type {FC, PropsWithChildren} from 'react';
import {useEffect} from 'react';
import {
  useGetSessionQuery,
  useGetUserRecordQuery,
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useRegisterMutation,
} from '~/redux/services/api';
import type {NextPageWithLayout} from '~/types/NextPage';
import {useAuth} from '../auth/hooks/useAuth';
import {UserContext} from './context';
import {useUser} from './hooks/useUser';

useLoginMutation;
useLogoutMutation;
useRegisterMutation;
useGetSessionQuery;
useRefreshTokenMutation;

export const UserProvider: FC<PropsWithChildren> = ({children}) => {
  const auth = useAuth();
  const userId = auth.session?.user.id ?? null;

  const userData = useGetUserRecordQuery(
    {
      userId: userId!,
      token: auth.token!,
    },
    {
      skip: userId === null,
      pollingInterval: 5000,
    }
  );

  const user =
    userId !== null && !userData.isError ? userData.data?.user ?? null : null;

  return (
    <UserContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const UserOnboardingRequired: FC<PropsWithChildren> = ({children}) => {
  const {user} = useUser();
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (user) return;

      const path = router.asPath;

      void router.push(`/onboarding?redirect=${encodeURIComponent(path)}`);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [user, router]);

  if (!user) return <></>;
  return <>{children}</>;
};

// function inspired by auth0 nextjs's withPageAuthRequired function
export const withUserOnboardingRequired = <T extends {} = {}>(
  Page: NextPageWithLayout
): NextPageWithLayout<T> => {
  const WithUserOnboardingRequired: NextPageWithLayout<T> = (props: T) => {
    return (
      <UserOnboardingRequired>
        <Page {...props} />
      </UserOnboardingRequired>
    );
  };

  WithUserOnboardingRequired.getLayout = Page.getLayout;

  return WithUserOnboardingRequired;
};
