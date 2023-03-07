import clsx from 'clsx';
import type {FC} from 'react';
import type {AuthFormProps} from '~/components/Auth/AuthForm';
import AuthForm from '~/components/Auth/AuthForm';
import AppIcon from '../AppIcon/AppIcon';

const AuthPage: FC<AuthFormProps> = props => {
  return (
    <div className="bg-auth grow py-6 bg-cover bg-center flex flex-col">
      <div className="container grow">
        <div
          className={clsx(
            'bg-black p-10 flex flex-col items-center justify-center gap-8 ring-2 ring-primary/25 max-w-xl mx-auto'
          )}
        >
          <AppIcon />
          <AuthForm {...props} />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
