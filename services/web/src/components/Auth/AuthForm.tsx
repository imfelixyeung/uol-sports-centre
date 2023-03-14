import clsx from 'clsx';
import {Field, Form, Formik} from 'formik';
import Link from 'next/link';
import {useRouter} from 'next/router';
import type {FC} from 'react';
import {useEffect, useMemo, useState} from 'react';
import {toast} from 'react-hot-toast';
import * as yup from 'yup';
import {useAuth} from '~/providers/auth/hooks/useAuth';
import getErrorFromAPIResponse from '~/utils/getErrorFromAPIResponse';
import Button from '../Button';
import Typography from '../Typography';
import useRedirectTo from './hooks/useRedirectTo';

export interface AuthFormProps {
  variant: 'login' | 'register';
}

const AuthForm: FC<AuthFormProps> = ({variant}) => {
  const auth = useAuth();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const redirectTo = useRedirectTo();

  useEffect(() => {
    if (!auth.session) return;

    void router.replace(redirectTo);
  }, [auth.session, redirectTo, router]);

  const urls = useMemo(() => {
    if (!redirectTo)
      return {
        login: '/auth/login',
        register: '/auth/register',
      };

    return {
      login: `/auth/login?redirect=${encodeURIComponent(redirectTo)}`,
      register: `/auth/register?redirect=${encodeURIComponent(redirectTo)}`,
    };
  }, [redirectTo]);

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
          rememberMe: false,
          acceptTerms: false,
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
        <Form className="flex w-full flex-col gap-3">
          <Typography.h2 styledAs="h1" uppercase className="text-center">
            {variant === 'login' ? 'Log Into Account' : 'Register Account'}
          </Typography.h2>

          <label htmlFor="email" className="flex flex-col">
            <span className="">Email Address</span>
            <Field
              id="email"
              name="email"
              type="email"
              className="bg-white p-2 text-black"
              placeholder="Email"
              inputMode="email"
              autoComplete="email"
            />
          </label>

          <label htmlFor="password" className="flex flex-col">
            <span className="">Password</span>
            <Field
              id="password"
              name="password"
              type="password"
              className="bg-white p-2 text-black"
              placeholder="Password"
              inputMode="password"
              autoComplete={
                variant === 'login' ? 'current-password' : 'new-password'
              }
            />
          </label>

          <div
            className={clsx(
              'flex flex-wrap justify-between gap-3',
              variant === 'login' ? 'flex-row' : 'flex-col'
            )}
          >
            <label className="flex items-center gap-3">
              <Field id="rememberMe" name="rememberMe" type="checkbox" />
              <span>Remember Me</span>
            </label>
            {variant === 'login' ? (
              <a href="" className="underline">
                Forgotten Password
              </a>
            ) : (
              <label className="flex items-center gap-3">
                <Field id="acceptTerms" name="acceptTerms" type="checkbox" />
                <span>
                  I Agree to the <a href="">Terms of Conditions</a> and the{' '}
                  <a href="">Privacy Policy</a>
                </span>
              </label>
            )}
          </div>

          {errorMessage && <div className="text-red-600">{errorMessage}</div>}

          <Button type="submit" intent="primary">
            {variant === 'login' ? 'Login' : 'Register'}
          </Button>

          <div className="text-sm">
            <span>
              {variant === 'register'
                ? 'Already have an account?'
                : 'Dont have an account?'}
            </span>{' '}
            <Link
              href={variant === 'register' ? urls.login : urls.register}
              className="underline"
            >
              {variant === 'register' ? 'Log In' : 'Create Account'}
            </Link>
          </div>
        </Form>
      </Formik>
    </>
  );
};

export default AuthForm;
