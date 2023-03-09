import {UserCircleIcon} from '@heroicons/react/24/solid';
import Link from 'next/link';
import AppIcon from '../AppIcon/AppIcon';
import Button from '../Button';

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
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/facilities">Facilities</Link>
            </li>
            <li>
              <Link href="/pricing">Pricing</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </nav>
        <Link href="/dashboard">
          <Button intent="primary" className="hidden md:block">
            Account
          </Button>
        </Link>
      </header>
    </div>
  );
};

export default AppBar;
