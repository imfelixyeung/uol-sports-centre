import clsx from 'clsx';
import type {FC, PropsWithChildren} from 'react';
import {useState} from 'react';
import {useAuth} from '~/providers/auth/hooks/useAuth';
import Drawer from './Drawer';

const Layout: FC<PropsWithChildren> = ({children}) => {
  const auth = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen(open => !open);

  return (
    <>
      {auth.session && (
        <aside
          className={clsx(
            'fixed md:max-w-[12rem] inset-x-0 md:w-full inset-y-0 bg-red-400 md:block',
            drawerOpen ? '' : 'hidden'
          )}
        >
          <Drawer onClosed={() => setDrawerOpen(false)} />
        </aside>
      )}
      <div
        className={clsx(
          'flex flex-col min-h-screen',
          auth.session && 'md:ml-[12rem]'
        )}
      >
        <div className="bg-red-400 md:bg-transparent">
          <header className="flex justify-between items-center m-3">
            <h1 className="bg-gray-200 p-3">Sports Center Website</h1>
            {auth.session && (
              <button
                className="p-3 bg-gray-300 md:hidden"
                onClick={toggleDrawer}
              >
                Menu
              </button>
            )}
          </header>
        </div>
        <main className="grow flex flex-col">{children}</main>
      </div>
    </>
  );
};

export default Layout;
