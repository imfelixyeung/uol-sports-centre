import type {FC} from 'react';
import type {AuthFormProps} from '~/components/Auth/AuthForm';
import AuthForm from '~/components/Auth/AuthForm';
import AppIcon from '../AppIcon/AppIcon';

const AuthPage: FC<AuthFormProps> = props => {
  return (
    <div className="from-red-600 bg-gradient-to-br via-purple-600 to-blue-600 grow py-6 flex flex-col">
      <div className="grid md:grid-cols-2 container grow">
        <div className="bg-black p-10 flex flex-col items-center justify-center gap-8">
          <AppIcon />
          <AuthForm {...props} />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
