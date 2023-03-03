import {type AppType} from 'next/dist/shared/lib/utils';
import {Toaster} from 'react-hot-toast';
import {Provider} from 'react-redux';
import Layout from '~/components/Layout/Layout';
import {AuthProvider} from '~/providers/auth';
import {store} from '~/redux/store';

import '~/styles/globals.css';

const MyApp: AppType = ({Component, pageProps}) => {
  return (
    <>
      <Provider store={store}>
        <AuthProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AuthProvider>
      </Provider>
      <Toaster />
    </>
  );
};

export default MyApp;
