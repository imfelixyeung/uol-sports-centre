import {type NextPage} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {toast} from 'react-hot-toast';
import {useAuth} from '~/providers/auth/hooks/useAuth';

const Home: NextPage = () => {
  const auth = useAuth();

  const handleLogout = async () => {
    await toast.promise(auth.logout(), {
      loading: 'Logging out...',
      success: 'You are now logged out',
      error: 'Something went wrong',
    });
  };

  return (
    <>
      <Head>
        <title>Sports Centre Management System</title>
      </Head>
      <div className="flex grow items-center justify-center bg-gradient-to-br from-fuchsia-600 to-orange-600 p-6 text-white flex-col">
        <h1 className="text-4xl font-bold md:text-6xl">
          Sports Centre Management System
        </h1>
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
      </div>
    </>
  );
};

export default Home;
