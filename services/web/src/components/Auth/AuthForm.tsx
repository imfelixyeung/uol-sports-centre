import {Field, Form, Formik} from 'formik';
import Link from 'next/link';
import {useRouter} from 'next/router';
import type {FC} from 'react';
import {useState} from 'react';
import {toast} from 'react-hot-toast';
import * as yup from 'yup';
import {useAuth} from '~/providers/auth/hooks/useAuth';
import getErrorFromAPIResponse from '~/utils/getErrorFromAPIResponse';
import Button from '../Button';
import Typography from '../Typography';

export interface AuthFormProps {
  variant: 'login' | 'register';
}

const AuthForm: FC<AuthFormProps> = ({variant}) => {
  const auth = useAuth();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
          rememberMe: false,
        }}
        onSubmit={async (values, actions) => {
          setErrorMessage(null);
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
            .then(() => router.push('/'))
            .catch(res => {
              const error = getErrorFromAPIResponse(res);
              if (error) setErrorMessage(error);
            });
          actions.setSubmitting(false);
        }}
        validationSchema={yup.object({
          email: yup.string().email().required(),
          password: yup.string().required().min(8, 'Password too short!'),
        })}
      >
        <Form className="flex flex-col gap-3">
          <Typography as="h2" uppercase className="text-center">
            {variant === 'login' ? 'Log Into Account' : 'Register'}
          </Typography>

          <label htmlFor="email" className="flex flex-col">
            <span className="">Email Address</span>
            <Field
              id="email"
              name="email"
              type="email"
              className="bg-white p-2"
              placeholder="Email"
            />
          </label>

          <label htmlFor="password" className="flex flex-col">
            <span className="">Password</span>
            <Field
              id="password"
              name="password"
              type="password"
              className="bg-white p-2"
              placeholder="Password"
            />
          </label>

          <div className="flex justify-between flex-wrap">
            <label className="flex gap-3 items-center">
              <Field id="rememberMe" name="rememberMe" type="checkbox" />
              <span>Remember Me</span>
            </label>
            <a href="" className="underline">
              Forgotten Password
            </a>
          </div>

          {errorMessage && <div className="text-red-600">{errorMessage}</div>}

          <Button type="submit" intent="primary">
            {variant === 'login' ? 'Login' : 'Register'}
          </Button>

          <div className="text-sm">
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
