import {UserCircleIcon} from '@heroicons/react/24/solid';
import Link from 'next/link';
import AppIcon from '../AppIcon/AppIcon';
import Button, {buttonStyles} from '../Button';

const navLinks = [
  {label: 'About', href: '/about'},
  {label: 'Facilities', href: '/facilities'},
  {label: 'Pricing', href: '/pricing'},
  {label: 'Contact', href: '/contact'},
];

const AppBar = () => {
  return (
    <div className="bg-black">
      <header className="flex justify-between items-center container py-6 flex-col md:flex-row gap-3">
        <div className="relative flex items-center justify-center w-full md:w-auto">
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
                <Link href={link.href}>{link.label}</Link>
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
