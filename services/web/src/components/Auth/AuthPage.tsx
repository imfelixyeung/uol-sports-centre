import clsx from 'clsx';
import {motion} from 'framer-motion';
import type {AuthFormProps} from '~/components/Auth/AuthForm';
import AuthForm from '~/components/Auth/AuthForm';
import type {NextPageWithLayout} from '~/types/NextPage';
import AppIcon from '../AppIcon/AppIcon';
import Seo from '../Seo';

const AuthPage: NextPageWithLayout<AuthFormProps> = props => {
  return (
    <>
      <Seo title={props.variant === 'login' ? 'Login' : 'Register'} />
      <div className="bg-auth grow py-6 bg-cover bg-center flex flex-col">
        <div
          className={clsx(
            'container grow flex items-center justify-center',
            props.variant === 'login' ? 'lg:justify-start' : 'lg:justify-end'
          )}
        >
          <motion.div
            layoutId="auth-form-wrapper"
            className="bg-black p-10 flex flex-col items-center justify-around gap-8 ring-2 ring-primary/25 max-w-xl grow min-h-[75vh]"
          >
            <AppIcon />
            <AuthForm {...props} />
          </motion.div>
        </div>
      </div>
    </>
  );
};

AuthPage.getLayout = page => (
  <main className="min-h-screen flex flex-col">{page}</main>
);

export default AuthPage;
