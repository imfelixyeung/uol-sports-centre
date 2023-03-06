import {UserCircleIcon} from '@heroicons/react/24/solid';
import Button from '../Button';

const AppBar = () => {
  return (
    <div className="bg-base-100">
      <header className="flex justify-between items-center container py-6 flex-col md:flex-row gap-3">
        <div className="relative flex items-center justify-center w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-base-content"></div>
            <h1 className="uppercase font-bold leading-6 text-2xl">
              Sports
              <br />
              Centre
            </h1>
          </div>
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
