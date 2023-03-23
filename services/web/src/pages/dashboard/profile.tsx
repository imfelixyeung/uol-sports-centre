import {Form, Formik} from 'formik';
import Button from '~/components/Button';
import FormField from '~/components/FormField';
import MembershipBanner from '~/components/MembershipBanner';
import PageHero from '~/components/PageHero';
import Typography from '~/components/Typography';
import {withPageAuthRequired} from '~/providers/auth';
import {useAuth} from '~/providers/auth/hooks/useAuth';
import {withUserOnboardingRequired} from '~/providers/user';
import {useUser} from '~/providers/user/hooks/useUser';

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

  if (!user || !session) return null;

  return (
    <Formik
      initialValues={{
        email: session.user.email ?? '',
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
      }}
      onSubmit={(values, actions) => {
        actions.setSubmitting(false);
        // const {firstName, lastName} = values;
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
