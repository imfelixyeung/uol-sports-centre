import {Field, Form, Formik} from 'formik';
import React from 'react';
import {useAuth} from '~/providers/auth/hooks/useAuth';

const RegisterPage = () => {
  const auth = useAuth();

  return (
    <div>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          password: '',
        }}
        onSubmit={(values, actions) => {
          const {email, firstName, lastName, password} = values;
          auth.register({email, password}, {firstName, lastName});
        }}
      >
        <Form>
          <Field name="firstName" autocomplete="given-name" />
          <Field name="lastName" autocomplete="family-name" />
          <Field name="email" type="email" autocomplete="email" />
          <Field name="password" type="password" autocomplete="new-password" />
          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </div>
  );
};

export default RegisterPage;
