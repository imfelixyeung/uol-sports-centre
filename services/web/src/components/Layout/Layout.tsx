import clsx from 'clsx';
import type {FC, PropsWithChildren} from 'react';
import {useAuth} from '~/providers/auth/hooks/useAuth';

const Layout: FC<PropsWithChildren> = ({children}) => {
  const auth = useAuth();

  return (
    <>
      {auth.session && (
        <aside className="fixed max-w-[12rem] w-full inset-y-0 bg-red-400">
          <div className="flex flex-col gap-3 mt-16 p-2">
            <div className="bg-teal-800 p-3 cursor-not-allowed">Profile</div>
            <div className="bg-gray-300 p-3 cursor-not-allowed">Membership</div>
            <div className="bg-gray-300 p-3 cursor-not-allowed">Facilities</div>
            <div className="bg-gray-300 p-3 cursor-not-allowed">Bookings</div>
            <div className="bg-gray-300 p-3 cursor-not-allowed">Bookings</div>
          </div>
        </aside>
      )}
      <div
        className={clsx(
          'flex flex-col min-h-screen',
          auth.session && 'ml-[12rem]'
        )}
      >
        <header className="px-3 py-6 m-2 bg-red-100 text-center text-2xl">
          Sports Center Website
        </header>
        <main className="grow flex flex-col">{children}</main>
      </div>
    </>
  );
};

export default Layout;
