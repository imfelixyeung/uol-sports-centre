import {Form, Formik} from 'formik';
import {toast} from 'react-hot-toast';
import Button from '~/components/Button';
import FormField from '~/components/FormField';
import MembershipBanner from '~/components/MembershipBanner';
import PageHero from '~/components/PageHero';
import Typography from '~/components/Typography';
import {withPageAuthRequired} from '~/providers/auth';
import {useAuth} from '~/providers/auth/hooks/useAuth';
import {withUserOnboardingRequired} from '~/providers/user';
import {useUser} from '~/providers/user/hooks/useUser';
import {
  useUpdateUserFirstNameMutation,
  useUpdateUserLastNameMutation,
} from '~/redux/services/api';

const ProfilePage = () => {
  const {user} = useUser();

  return (
    <div className="flex grow flex-col">
      <PageHero
        title={user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
        subtitle={user?.membership ?? 'No membership...'}
      />
      <section className="container my-8 flex grow gap-8">
        <MembershipBanner />
      </section>
      <section className="container my-8 flex grow gap-8">
        <ProfileEditForm />
      </section>
    </div>
  );
};

export default withPageAuthRequired(withUserOnboardingRequired(ProfilePage));

const ProfileEditForm = () => {
  const {user} = useUser();
  const {session} = useAuth();
  const [updateFirstName] = useUpdateUserFirstNameMutation();
  const [updateLastName] = useUpdateUserLastNameMutation();

  if (!user || !session) return null;

  return (
    <Formik
      initialValues={{
        email: session.user.email ?? '',
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
      }}
      onSubmit={async (values, actions) => {
        const {firstName, lastName} = values;
        await toast.promise(
          Promise.all([
            updateFirstName({id: user.id, firstName}),
            updateLastName({id: user.id, lastName}),
          ]),
          {
            loading: 'Updating...',
            success: 'Account information updated!',
            error: 'Something went wrong...',
          }
        );
        actions.setSubmitting(false);
      }}
      enableReinitialize
    >
      <Form className="grow">
        <Typography.h2>Account Information</Typography.h2>
        <div className="my-6 grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <FormField name="email" label="Email" disabled />
          </div>
          <div className="col-span-1">
            <FormField name="firstName" label="First Name" required />
          </div>
          <div className="col-span-1">
            <FormField name="lastName" label="Last Name" required />
          </div>
        </div>
        <Button type="submit" intent="primary">
          Update
        </Button>
      </Form>
    </Formik>
  );
};
