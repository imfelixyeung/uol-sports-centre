import dayjs from 'dayjs';
import {Form, Formik} from 'formik';
import type {NextPage} from 'next';
import type {FC} from 'react';
import {useState} from 'react';
import toast from 'react-hot-toast';
import Button from '~/components/Button';
import FormField from '~/components/FormField';
import Typography from '~/components/Typography';
import {withPageAuthRequired} from '~/providers/auth';
import {useAuth} from '~/providers/auth/hooks/useAuth';
import {withUserOnboardingRequired} from '~/providers/user';
import {
  useGetAuthUsersQuery,
  useGetUserRecordQuery,
  useUpdateUserFirstNameMutation,
  useUpdateUserLastNameMutation,
  useUpdateUserMembershipMutation,
} from '~/redux/services/api';

const ManageUsersPage: NextPage = () => {
  const {token} = useAuth();
  const [page, setPage] = useState(0);
  const usersData = useGetAuthUsersQuery({token: token!, pageIndex: page});

  if (usersData.isLoading) return <>Loading...</>;
  if (usersData.isError || !usersData.data) return <>Something went wrong</>;

  const users = usersData.data.data;

  const prevPage = () => setPage(page => Math.max(page - 1, 0));
  const nextPage = () => setPage(page => page + 1);

  return (
    <div className="container py-8">
      <Button onClick={prevPage} intent="primary">
        Prev Page
      </Button>
      <Button onClick={nextPage} intent="primary">
        Next Page
      </Button>
      {users.map(user => (
        <div key={user.id}>
          <Typography.h2>{user.id}</Typography.h2>
          <Typography.p styledAs="data">Email: {user.email}</Typography.p>
          <Typography.p styledAs="data">Role: {user.role}</Typography.p>
          <Typography.p styledAs="data">
            Joined: {dayjs(user.createdAt).fromNow()}
          </Typography.p>
          <Typography.p styledAs="data">
            Edited: {dayjs(user.updatedAt).fromNow()}
          </Typography.p>
          <EditUserRecordForm userId={user.id} />
        </div>
      ))}
    </div>
  );
};

export default withPageAuthRequired(
  withUserOnboardingRequired(ManageUsersPage),
  {rolesAllowed: ['ADMIN', 'MANAGER']}
);

const EditUserRecordForm: FC<{
  userId: number;
}> = ({userId}) => {
  // const {token} = useAuth();
  const userData = useGetUserRecordQuery(userId);
  const [updateFirstName] = useUpdateUserFirstNameMutation();
  const [updateLastName] = useUpdateUserLastNameMutation();
  const [updateMembership] = useUpdateUserMembershipMutation();

  if (userData.isLoading) return <>Loading...</>;
  if (userData.isError || !userData.data)
    return (
      <>
        Something went wrong, this user might not have competed their onboarding
        yet
      </>
    );

  const user = userData.data.user;

  return (
    <Formik
      initialValues={{...user}}
      onSubmit={async (values, actions) => {
        const {firstName, lastName, membership} = values;
        await toast.promise(
          Promise.all([
            updateFirstName({id: user.id, firstName}),
            updateLastName({id: user.id, lastName}),
            updateMembership({id: user.id, membership}),
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
      <Form>
        <FormField name="firstName" label="First name" />
        <FormField name="lastName" label="Last name" />
        <FormField name="membership" label="Membership" />
        <Button intent="primary">Save</Button>
      </Form>
    </Formik>
  );
};
