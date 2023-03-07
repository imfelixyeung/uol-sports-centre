import clsx from 'clsx';
import type {AuthFormProps} from '~/components/Auth/AuthForm';
import AuthForm from '~/components/Auth/AuthForm';
import type {NextPageWithLayout} from '~/types/NextPage';
import AppIcon from '../AppIcon/AppIcon';

const AuthPage: NextPageWithLayout<AuthFormProps> = props => {
  return (
    <div className="bg-auth grow py-6 bg-cover bg-center flex flex-col">
      <div className="container grow flex items-center">
        <div
          className={clsx(
            'bg-black p-10 flex flex-col items-center justify-center gap-8 ring-2 ring-primary/25 max-w-xl mx-auto grow'
          )}
        >
          <AppIcon />
          <AuthForm {...props} />
        </div>
      </div>
    </div>
  );
};

AuthPage.getLayout = page => (
  <main className="min-h-screen flex flex-col">{page}</main>
);

export default AuthPage;
