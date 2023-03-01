import {type AppType} from 'next/dist/shared/lib/utils';
import {Provider} from 'react-redux';
import {store} from '~/redux/store';

import '~/styles/globals.css';

const MyApp: AppType = ({Component, pageProps}) => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default MyApp;
