import {Form, Formik} from 'formik';
import type {NextPage} from 'next';
import {toast} from 'react-hot-toast';
import * as Yup from 'yup';
import Button from '~/components/Button';
import FormField from '~/components/FormField';
import PageHero from '~/components/PageHero';
import Typography from '~/components/Typography';
import {withPageAuthRequired} from '~/providers/auth';
import {useAuth} from '~/providers/auth/hooks/useAuth';
import {withUserOnboardingRequired} from '~/providers/user';
import {useUpdateAuthUserMutation} from '~/redux/services/api';
import getErrorFromAPIResponse from '~/utils/getErrorFromAPIResponse';

const ManagementPage: NextPage = () => {
  return (
    <div>
      <PageHero title="Managemer Dashboard" />
      <section className="container">
        <Typography.h2>Amend Prices</Typography.h2>
        <form action="">Form</form>
        <Typography.h2>Change discount amount</Typography.h2>
        <form action="">Form</form>
        <Typography.h2>Add new employee</Typography.h2>
        <AddNewEmployeeForm />
        <Typography.h2>Add facility</Typography.h2>
        <form action="">Form</form>
        <Typography.h2>Amend facility</Typography.h2>
        <form action="">Form</form>
        <Typography.h2>Add activity</Typography.h2>
        <form action="">Form</form>
        <Typography.h2>Amend activity</Typography.h2>
        <form action="">Form</form>
        <Typography.h2>Data visualisation from today to today-7</Typography.h2>
        <Typography.h3>Total sales</Typography.h3>
        <Typography.h3>Total facility bookings</Typography.h3>
        <Typography.h3>Total activity bookings</Typography.h3>
      </section>
    </div>
  );
};

export default withPageAuthRequired(
  withUserOnboardingRequired(ManagementPage),
  {rolesAllowed: ['ADMIN', 'MANAGER']}
);

const AddNewEmployeeForm = () => {
  const [updateAuthUser] = useUpdateAuthUserMutation();
  const {token} = useAuth();

  return (
    <Formik
      initialValues={{userId: undefined} as unknown as {userId: number}}
      onSubmit={async function (values, actions) {
        const {userId} = values;
        await toast.promise(
          updateAuthUser({
            role: 'EMPLOYEE',
            userId,
            token: token!,
          }).unwrap(),
          {
            loading: 'Adding new employee...',
            success: 'New employee added',
            error: error =>
              getErrorFromAPIResponse(error) || 'Something went wrong',
          }
        );
        actions.setSubmitting(false);
      }}
      validationSchema={Yup.object({userId: Yup.number().required('Required')})}
    >
      <Form>
        <FormField label="User Id" required name="userId" />
        <Button type="submit" intent="primary">
          Add
        </Button>
      </Form>
    </Formik>
  );
};
