import Link from 'next/link';
import toast from 'react-hot-toast';
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
    <div>
      <pre>
        <code>{JSON.stringify(auth, null, 2)}</code>
        {auth.session ? (
          <>
            <p>Hello, {auth.session.user.email}</p>
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login">Login</Link>
            <Link href="/auth/register">Register</Link>
          </>
        )}
      </pre>
    </div>
  );
};

export default AuthPage;
