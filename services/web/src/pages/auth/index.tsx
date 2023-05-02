import Link from 'next/link';
import toast from 'react-hot-toast';
import AppIcon from '~/components/AppIcon/AppIcon';
import Button, {buttonStyles} from '~/components/Button';
import Json from '~/components/Json';
import Typography from '~/components/Typography';
import {useAuth} from '~/providers/auth/hooks/useAuth';

const AuthPage = () => {
  const auth = useAuth();

  const handleLogout = () => {
    void toast.promise(auth.logout(), {
      loading: 'Logging out...',
      success: 'You are now logged out',
      error: 'Something went wrong',
    });
  };
  return (
    <div className="container">
      <div className="mx-auto flex max-w-[16rem] flex-col justify-center gap-3">
        <div className="flex justify-center">
          <AppIcon />
        </div>
        {auth.session ? (
          <>
            <Button intent="primary" type="button" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link
              href={`/auth/login?redirect=${encodeURIComponent('/auth')}`}
              className={buttonStyles({intent: 'primary'})}
            >
              Login
            </Link>
            <Link
              href={`/auth/register?redirect=${encodeURIComponent('/auth')}`}
              className={buttonStyles({intent: 'primary'})}
            >
              Register
            </Link>
          </>
        )}
      </div>
      {auth.session && (
        <div className="my-8 bg-white p-8 text-black">
          <Typography.h2>This is you!</Typography.h2>
          <Typography.p styledAs="subtext">For demo only</Typography.p>
          <Json data={auth.session} />
          <Typography.h3 className="mt-6">Your Tokens</Typography.h3>
          <Typography.p styledAs="subtext">
            For demo only, refresh tokens should be kept securely
          </Typography.p>
          <Json
            data={{
              accessToken: auth.token,
              refreshToken: auth.refreshToken,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AuthPage;
