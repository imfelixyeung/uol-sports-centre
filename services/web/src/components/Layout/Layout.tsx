import type {FC, PropsWithChildren} from 'react';
import AppBar from './AppBar';
import Footer from './Footer';

const Layout: FC<PropsWithChildren> = ({children}) => {
  return (
    <div className="flex min-h-screen flex-col">
      <AppBar />
      <main className="flex grow flex-col">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
