import {Field, Form, Formik} from 'formik';
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
        <Form>
          <Field name="email" type="email" />
          <Field name="password" type="password" />
          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </div>
  );
};

export default LoginPage;
