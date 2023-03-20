// Adapted some logic from https://nextjs.org/docs/basic-features/layouts

import clsx from 'clsx';
import {type AppType} from 'next/dist/shared/lib/utils';
import {Saira, Saira_Condensed} from 'next/font/google';
import {Provider} from 'react-redux';
import CustomToaster from '~/components/CustomToaster';
import {Layout} from '~/components/Layout';
import {AuthProvider} from '~/providers/auth';
import {UserProvider} from '~/providers/user';
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
        <AuthProvider>
          <UserProvider>{getLayout(<Component {...pageProps} />)}</UserProvider>
        </AuthProvider>
      </Provider>
      <CustomToaster />
    </div>
  );
};

export default MyApp;
