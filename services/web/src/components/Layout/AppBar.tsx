import {UserCircleIcon} from '@heroicons/react/24/solid';
import AppIcon from '../AppIcon/AppIcon';
import Button from '../Button';

const AppBar = () => {
  return (
    <div className="bg-black">
      <header className="flex justify-between items-center container py-6 flex-col md:flex-row gap-3">
        <div className="relative flex items-center justify-center w-full md:w-auto">
          <AppIcon />
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
              <a href="">About</a>
            </li>
            <li>
              <a href="">Facilities</a>
            </li>
            <li>
              <a href="">Pricing</a>
            </li>
            <li>
              <a href="">Contact</a>
            </li>
          </ul>
        </nav>
        <Button intent="primary" className="hidden md:block">
          Account
        </Button>
      </header>
    </div>
  );
};

export default AppBar;
