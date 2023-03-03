import type {FC} from 'react';
import type {AuthFormProps} from '~/components/Auth/AuthForm';
import AuthForm from '~/components/Auth/AuthForm';

const AuthPage: FC<AuthFormProps> = props => {
  return (
    <section className="grow flex flex-row-reverse">
      <main className="md:max-w-lg max-w-none grow bg-gray-200 p-6 flex flex-col justify-center">
        <AuthForm {...props} />
      </main>
      <aside className="grow hidden md:block"></aside>
    </section>
  );
};

export default AuthPage;
