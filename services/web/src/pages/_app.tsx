// Adapted some logic from https://nextjs.org/docs/basic-features/layouts

import clsx from 'clsx';
import {type AppType} from 'next/dist/shared/lib/utils';
import {Saira, Saira_Condensed} from 'next/font/google';
import {Toaster} from 'react-hot-toast';
import {Provider} from 'react-redux';
import Layout from '~/components/Layout/Layout';
import {AuthProvider} from '~/providers/auth';
import {store} from '~/redux/store';

import '~/styles/globals.css';
import type {NextComponentTypeWithLayout} from '~/types/NextPage';

const saira = Saira({
  variable: '--font-saira',
  subsets: ['latin'],
});

const sairaCondensed = Saira_Condensed({
  variable: '--font-saira-condensed',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

const MyApp: AppType = ({Component, pageProps}) => {
  const getLayout =
    (Component as NextComponentTypeWithLayout).getLayout ??
    (page => <Layout>{page}</Layout>);

  return (
    <div
      className={clsx(saira.variable, sairaCondensed.variable, 'font-body')}
      id="app"
    >
      <Provider store={store}>
        <AuthProvider>{getLayout(<Component {...pageProps} />)}</AuthProvider>
      </Provider>
      <Toaster />
    </div>
  );
};

export default MyApp;
