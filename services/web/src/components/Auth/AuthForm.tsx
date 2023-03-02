import {Field, Form, Formik} from 'formik';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {FC} from 'react';
import {toast} from 'react-hot-toast';
import * as yup from 'yup';
import {useAuth} from '~/providers/auth/hooks/useAuth';

export interface AuthFormProps {
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
        validationSchema={yup.object({
          email: yup.string().email().required(),
          password: yup.string().required().min(8, 'Password too short!'),
        })}
      >
        <Form className="flex flex-col gap-3 text-center">
          <h2 className="font-bold text-2xl mb-6">
            {variant === 'login' ? 'Log In' : 'Register'}
          </h2>

          <label htmlFor="email" className="flex flex-col">
            <span className="sr-only">Email</span>
            <Field
              id="email"
              name="email"
              type="email"
              className="bg-white p-2"
              placeholder="Email"
            />
          </label>

          <label htmlFor="password" className="flex flex-col">
            <span className="sr-only">Password</span>
            <Field
              id="password"
              name="password"
              type="password"
              className="bg-white p-2"
              placeholder="Password"
            />
          </label>

          <button type="submit" className="p-3 bg-red-300">
            {variant === 'login' ? 'Log In' : 'Register'}
          </button>

          <div className="bg-white p-2 text-sm">
            <span>
              {variant === 'register'
                ? 'Already have an account?'
                : 'Dont have an account yet?'}
            </span>{' '}
            <Link
              href={variant === 'register' ? '/auth/login' : '/auth/register'}
              className="underline"
            >
              {variant === 'register' ? 'Log In' : 'Register'}
            </Link>
          </div>
        </Form>
      </Formik>
    </>
  );
};

export default AuthForm;
