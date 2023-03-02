import {Field, Form, Formik} from 'formik';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {FC} from 'react';
import {toast} from 'react-hot-toast';
import {useAuth} from '~/providers/auth/hooks/useAuth';

interface AuthFormProps {
  variant: 'login' | 'register';
}

const AuthForm: FC<AuthFormProps> = ({variant}) => {
  const auth = useAuth();
  const router = useRouter();
  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={async (values, actions) => {
          await toast
            .promise(
              variant === 'login' ? auth.login(values) : auth.register(values),
              variant === 'login'
                ? {
                    loading: 'Logging in...',
                    success: 'Logged in!',
                    error: 'Failed to login',
                  }
                : {
                    loading: 'Registering...',
                    success: 'Registered!',
                    error: 'Failed to register',
                  }
            )
            .then(() => router.push('/'));
          actions.setSubmitting(false);
        }}
      >
        <Form className="bg-gray-200 p-3">
          <h2 className="font-bold">
            {variant === 'login' ? 'Login' : 'Register'}
          </h2>
          <label htmlFor="email">email</label>
          <Field id="email" name="email" type="email" />
          <br />
          <label htmlFor="password">password</label>
          <Field id="password" name="password" type="password" />
          <br />
          <button type="submit">
            {variant === 'login' ? 'Login' : 'Register'}
          </button>
          <br />
          <span>
            <span>
              {variant === 'register'
                ? 'Already have an account?'
                : 'Dont have an account yet?'}
            </span>{' '}
            <Link
              href={variant === 'register' ? '/auth/login' : '/auth/register'}
              className="underline"
            >
              {variant === 'register' ? 'Login' : 'Register'}
            </Link>
          </span>
        </Form>
      </Formik>
    </>
  );
};

export default AuthForm;
