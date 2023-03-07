import clsx from 'clsx';
import {motion} from 'framer-motion';
import type {FC} from 'react';
import type {AuthFormProps} from '~/components/Auth/AuthForm';
import AuthForm from '~/components/Auth/AuthForm';
import AppIcon from '../AppIcon/AppIcon';

const AuthPage: FC<AuthFormProps> = props => {
  return (
    <div className="bg-auth grow py-6 bg-cover bg-center flex flex-col">
      <div className="grid md:grid-cols-2 container grow">
        <motion.div
          layoutId="auth-page"
          className={clsx(
            'bg-black p-10 flex flex-col items-center justify-center gap-8 ring-2 ring-primary/25',
            props.variant === 'login' ? 'md:col-start-1' : 'md:col-start-2'
          )}
        >
          <AppIcon />
          <AuthForm {...props} />
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
