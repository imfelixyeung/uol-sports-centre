import {FC} from 'react';
import AuthForm, {AuthFormProps} from '~/components/Auth/AuthForm';

const AuthPage: FC<AuthFormProps> = props => {
  return (
    <div className="min-h-screen w-screen flex flex-row-reverse">
      <main className="md:max-w-lg max-w-none grow bg-gray-200 p-6 flex flex-col justify-center">
        <AuthForm {...props} />
      </main>
      <aside className="bg-cyan-200 grow hidden md:block"></aside>
    </div>
  );
};

export default AuthPage;
