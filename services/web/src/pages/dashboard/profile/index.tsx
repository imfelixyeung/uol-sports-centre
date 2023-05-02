import {Form, Formik} from 'formik';
import {useRouter} from 'next/router';
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
        subtitle={`User ID: ${user?.id || 'null'}`}
        side={<MembershipBanner />}
      />
      <div className="grow bg-white text-black">
        <section className="container my-8 flex gap-8">
          <ProfileEditForm />
        </section>
      </div>
    </div>
  );
};

export default withPageAuthRequired(withUserOnboardingRequired(ProfilePage));

const ProfileEditForm = () => {
  const {user} = useUser();
  const {session} = useAuth();
  const router = useRouter();
  const [updateFirstName] = useUpdateUserFirstNameMutation();
  const [updateLastName] = useUpdateUserLastNameMutation();
  const {token} = useAuth();

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
            updateFirstName({id: user.id, firstName, token: token!}),
            updateLastName({id: user.id, lastName, token: token!}),
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
        <Typography.h2 styledAs="h1" uppercase>
          Account Information
        </Typography.h2>
        <div className="my-8 grid lg:grid-cols-2">
          <div>
            <Typography.h3 styledAs="h2" uppercase>
              Name
            </Typography.h3>
            <Typography.p>What should we call you</Typography.p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-1">
              <FormField name="firstName" label="First Name" required />
            </div>
            <div className="col-span-1">
              <FormField name="lastName" label="Last Name" required />
            </div>
          </div>
        </div>
        <hr />
        <div className="my-8 grid lg:grid-cols-2">
          <div>
            <Typography.h3 styledAs="h2" uppercase>
              Contact
            </Typography.h3>
            <Typography.p>How should we contact you</Typography.p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <FormField name="email" label="Email" required disabled />
            </div>
          </div>
        </div>
        <hr />
        <div className="my-8 flex justify-between">
          <Button
            type="button"
            intent="secondary"
            outline
            onClick={() => void router.back()}
          >
            Back
          </Button>

          <Button type="submit" intent="primary" outline>
            Update Profile
          </Button>
        </div>
      </Form>
    </Formik>
  );
};
