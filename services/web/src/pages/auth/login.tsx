import {Field, Form, Formik} from 'formik';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {toast} from 'react-hot-toast';
import {useAuth} from '~/providers/auth/hooks/useAuth';

const LoginPage = () => {
  const auth = useAuth();
  const router = useRouter();

  return (
    <div>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={async (values, actions) => {
          await toast
            .promise(auth.login(values), {
              loading: 'Logging in...',
              success: 'Logged in!',
              error: 'Failed to login',
            })
            .then(() => router.push('/'));
          actions.setSubmitting(false);
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
