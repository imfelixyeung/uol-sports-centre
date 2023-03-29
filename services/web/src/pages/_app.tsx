// Adapted some logic from https://nextjs.org/docs/basic-features/layouts

import {type AppType} from 'next/dist/shared/lib/utils';
import {Provider} from 'react-redux';
import CustomToaster from '~/components/CustomToaster';
import {Layout} from '~/components/Layout';
import {AuthProvider} from '~/providers/auth';
import {UserProvider} from '~/providers/user';
import {store} from '~/redux/store';
import type {NextComponentTypeWithLayout} from '~/types/NextPage';

import '~/styles/globals.css';

const MyApp: AppType = ({Component, pageProps}) => {
  const getLayout =
    (Component as NextComponentTypeWithLayout).getLayout ??
    (page => <Layout>{page}</Layout>);

  return (
    <div className="font-body" id="app">
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
