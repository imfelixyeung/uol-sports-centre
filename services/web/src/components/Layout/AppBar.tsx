import {UserCircleIcon} from '@heroicons/react/24/solid';
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
      <header className="container flex flex-col items-center justify-between gap-3 py-6 md:flex-row">
        <div className="relative flex w-full items-center justify-center md:w-auto">
          <Link href="/">
            <AppIcon />
          </Link>
          <Link
            href="/dashboard"
            className={buttonStyles({
              intent: 'primary',
              className: 'absolute right-0 md:hidden',
              square: true,
            })}
          >
            <UserCircleIcon className="h-6" />
          </Link>
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
          <Link
            href="/dashboard"
            className={buttonStyles({
              intent: 'primary',
              className: 'hidden md:block',
            })}
          >
            Account
          </Link>
          {auth.session ? (
            <Button
              intent="primary"
              type="button"
              onClick={() => void handleLogout()}
            >
              Logout
            </Button>
          ) : (
            <Link
              href={`/auth/login?redirect=${encodeURIComponent('/dashboard')}`}
              className={buttonStyles({intent: 'primary'})}
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
