import {type AppType} from 'next/dist/shared/lib/utils';
import {Provider} from 'react-redux';
import {AuthProvider} from '~/providers/auth';
import {store} from '~/redux/store';
import {Toaster} from 'react-hot-toast';

import '~/styles/globals.css';

const MyApp: AppType = ({Component, pageProps}) => {
  return (
    <>
      <Provider store={store}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </Provider>
      <Toaster />
    </>
  );
};

export default MyApp;
