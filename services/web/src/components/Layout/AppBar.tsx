import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import {useRouter} from 'next/router';
import toast from 'react-hot-toast';
import {useAuth} from '~/providers/auth/hooks/useAuth';
import AppIcon from '../AppIcon/AppIcon';
import Button, {buttonStyles} from '../Button';
import Typography from '../Typography';

const navLinks = [
  {label: 'About', href: '/about'},
  {label: 'Facilities', href: '/facilities'},
  {label: 'Pricing', href: '/pricing'},
  {label: 'Contact', href: '/contact'},
];

const AppBar = () => {
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await toast.promise(auth.logout(), {
      loading: 'Logging out...',
      success: 'You are now logged out',
      error: 'Something went wrong',
    });
    await router.push('/');
  };

  return (
    <div className="bg-black">
      <header className="flex flex-col items-center justify-between gap-3 py-6 md:container md:flex-row">
        <div className="relative flex w-full items-center justify-center md:w-auto">
          <Link href="/">
            <AppIcon />
          </Link>
          <span className="absolute right-4 flex gap-2 md:hidden">
            <Link
              href="/dashboard"
              className={buttonStyles({
                intent: 'primary',
                square: true,
              })}
            >
              <UserCircleIcon className="h-6" />
            </Link>
            {auth.session && (
              <Button
                intent="secondary"
                square
                onClick={() => void handleLogout()}
              >
                <ArrowRightOnRectangleIcon className="h-6" />
              </Button>
            )}
          </span>
        </div>
        <nav>
          <ul className="flex gap-6 font-bold">
            {navLinks.map((link, index) => (
              <li key={index}>
                <Link href={link.href}>
                  <Typography.span styledAs="navLink">
                    {link.label}
                  </Typography.span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          {auth.session ? (
            <>
              <Link
                href="/dashboard"
                className={buttonStyles({
                  intent: 'primary',
                  className: 'hidden !text-base md:block',
                })}
              >
                Account
              </Link>
              <Button
                intent="secondary"
                type="button"
                onClick={() => void handleLogout()}
                className="hidden !text-base md:block"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link
              href={`/auth/login?redirect=${encodeURIComponent('/dashboard')}`}
              className={buttonStyles({
                intent: 'primary',
                className: 'hidden md:block',
              })}
            >
              Login
            </Link>
          )}
        </div>
      </header>
    </div>
  );
};

export default AppBar;
