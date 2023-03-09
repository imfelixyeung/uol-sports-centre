import {UserCircleIcon} from '@heroicons/react/24/solid';
import Link from 'next/link';
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
  return (
    <div className="bg-black">
      <header className="container flex flex-col items-center justify-between gap-3 py-6 md:flex-row">
        <div className="relative flex w-full items-center justify-center md:w-auto">
          <Link href="/">
            <AppIcon />
          </Link>
          <Button
            intent="primary"
            className="absolute right-0 md:hidden"
            square
          >
            <UserCircleIcon className="h-6" />
          </Button>
        </div>
        <nav>
          <ul className="flex gap-6 font-bold">
            {navLinks.map((link, index) => (
              <li key={index}>
                <Link href={link.href}>
                  <Typography as="span" styledAs="navLink">
                    {link.label}
                  </Typography>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link
          href="/dashboard"
          className={buttonStyles({
            intent: 'primary',
            className: 'hidden md:block',
          })}
        >
          Account
        </Link>
      </header>
    </div>
  );
};

export default AppBar;
