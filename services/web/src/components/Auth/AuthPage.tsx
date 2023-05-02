import clsx from 'clsx';
import {motion} from 'framer-motion';
import Link from 'next/link';
import type {AuthFormProps} from '~/components/Auth/AuthForm';
import AuthForm from '~/components/Auth/AuthForm';
import type {NextPageWithLayout} from '~/types/NextPage';
import AppIcon from '../AppIcon/AppIcon';
import Seo from '../Seo';

const AuthPage: NextPageWithLayout<AuthFormProps> = props => {
  return (
    <>
      <Seo title={props.variant === 'login' ? 'Login' : 'Register'} />
      <div className="flex grow flex-col bg-auth bg-cover bg-center py-6">
        <div
          className={clsx(
            'container flex grow items-center justify-center',
            props.variant === 'login' ? 'lg:justify-start' : 'lg:justify-end'
          )}
        >
          <motion.div
            layoutId="auth-form-wrapper"
            className="flex min-h-[75vh] max-w-xl grow flex-col items-center justify-around gap-8 bg-black p-10 ring-2 ring-primary/25"
          >
            <Link href="/">
              <AppIcon />
            </Link>
            <AuthForm {...props} />
          </motion.div>
        </div>
      </div>
    </>
  );
};

AuthPage.getLayout = page => (
  <main className="flex min-h-screen flex-col">{page}</main>
);

export default AuthPage;
