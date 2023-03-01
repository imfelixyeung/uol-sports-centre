import {Field, Form, Formik} from 'formik';
import Link from 'next/link';
import React from 'react';
import {useAuth} from '~/providers/auth/hooks/useAuth';

const LoginPage = () => {
  const auth = useAuth();

  return (
    <div>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={(values, actions) => {
          auth.login(values);
        }}
      >
        <Form className="bg-gray-200 p-3">
          <h2 className="font-bold">Login</h2>
          <label htmlFor="email">email</label>
          <Field id="email" name="email" type="email" />
          <br />
          <label htmlFor="password">password</label>
          <Field id="password" name="password" type="password" />
          <br />
          <button type="submit">Submit</button>
          <br />
          <span>
            Dont have an account yet?{' '}
            <Link href="/auth/register" className="underline">
              Register
            </Link>
          </span>
        </Form>
      </Formik>
    </div>
  );
};

export default LoginPage;
