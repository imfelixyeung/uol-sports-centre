import {Field, Form, Formik} from 'formik';
import Link from 'next/link';
import {useRouter} from 'next/router';
import toast from 'react-hot-toast';
import {useAuth} from '~/providers/auth/hooks/useAuth';

const RegisterPage = () => {
  const auth = useAuth();
  const router = useRouter();

  return (
    <div>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          password: '',
        }}
        onSubmit={async (values, actions) => {
          const {email, firstName, lastName, password} = values;
          await toast
            .promise(auth.register({email, password}, {firstName, lastName}), {
              loading: 'Registering...',
              success: 'Register!',
              error: 'Failed to register',
            })
            .then(() => router.push('/'));
          actions.setSubmitting(false);
        }}
      >
        <Form className="bg-gray-200 p-3">
          <h2 className="font-bold">Register</h2>
          <label htmlFor="firstName">firstName</label>
          <Field id="firstName" name="firstName" autocomplete="given-name" />
          <br />
          <label htmlFor="lastName">lastName</label>
          <Field id="lastName" name="lastName" autocomplete="family-name" />
          <br />
          <label htmlFor="email">email</label>
          <Field id="email" name="email" type="email" autocomplete="email" />
          <br />
          <label htmlFor="password">password</label>
          <Field
            id="password"
            name="password"
            type="password"
            autocomplete="new-password"
          />
          <br />
          <button type="submit">Submit</button>
          <span>
            Already have an account?{' '}
            <Link href="/auth/login" className="underline">
              Login
            </Link>
          </span>
        </Form>
      </Formik>
    </div>
  );
};

export default RegisterPage;
