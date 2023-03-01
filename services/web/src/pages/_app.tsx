import {type AppType} from 'next/dist/shared/lib/utils';
import {Provider} from 'react-redux';
import {AuthProvider} from '~/providers/auth';
import {store} from '~/redux/store';

import '~/styles/globals.css';

const MyApp: AppType = ({Component, pageProps}) => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </Provider>
  );
};

export default MyApp;
