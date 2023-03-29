import {Form, Formik} from 'formik';
import type {FC} from 'react';
import toast from 'react-hot-toast';
import {
  useGetUserRecordQuery,
  useUpdateUserFirstNameMutation,
  useUpdateUserLastNameMutation,
  useUpdateUserMembershipMutation,
} from '~/redux/services/api';
import Button from './Button';
import FormField from './FormField';

export const EditUserRecordForm: FC<{
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
