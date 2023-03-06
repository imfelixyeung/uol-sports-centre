import type {FC, PropsWithChildren} from 'react';
import AppBar from './AppBar';
import Footer from './Footer';

const Layout: FC<PropsWithChildren> = ({children}) => {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <AppBar />
        <main className="grow flex flex-col">{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
