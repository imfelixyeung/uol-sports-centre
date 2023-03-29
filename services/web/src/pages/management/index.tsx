import {Form, Formik} from 'formik';
import type {NextPage} from 'next';
import {useState} from 'react';
import {toast} from 'react-hot-toast';
import * as Yup from 'yup';
import Button from '~/components/Button';
import FormField from '~/components/FormField';
import PageHero from '~/components/PageHero';
import Typography from '~/components/Typography';
import {withPageAuthRequired} from '~/providers/auth';
import {useAuth} from '~/providers/auth/hooks/useAuth';
import {withUserOnboardingRequired} from '~/providers/user';
import {
  useCreateFacilityActivityMutation,
  useCreateFacilityMutation,
  useGetFacilitiesQuery,
  useGetFacilityActivitiesQuery,
  useUpdateAuthUserMutation,
  useUpdateFacilityActivityMutation,
  useUpdateFacilityMutation,
} from '~/redux/services/api';
import getErrorFromAPIResponse from '~/utils/getErrorFromAPIResponse';

const ManagementPage: NextPage = () => {
  return (
    <>
      <PageHero title="Managemer Dashboard" />
      <section className="container flex flex-col gap-3 py-8">
        <Typography.h2>Amend Prices</Typography.h2>
        <form action="">Form</form>
        <Typography.h2>Change discount amount</Typography.h2>
        <UpdateDiscountForm />
        <Typography.h2>Add new employee</Typography.h2>
        <AddNewEmployeeForm />
        <Typography.h2>Add facility</Typography.h2>
        <AddFacilityForm />
        <Typography.h2>Amend facility</Typography.h2>
        <UpdateFacilityForm />
        <Typography.h2>Add activity</Typography.h2>
        <AddActivityForm />
        <Typography.h2>Amend activity</Typography.h2>
        <UpdateActivityForm />
        <Typography.h2>Data visualisation from today to today-7</Typography.h2>
        <Typography.h3>Total sales</Typography.h3>
        <Typography.h3>Total facility bookings</Typography.h3>
        <Typography.h3>Total activity bookings</Typography.h3>
      </section>
    </>
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

const UpdateDiscountForm = () => {
  const discount = 0.15;
  return (
    <Formik
      initialValues={{discount}}
      onSubmit={(values, actions) => {
        const {discount} = values;
        actions.setSubmitting(false);
      }}
      validationSchema={Yup.object({userId: Yup.number().required('Required')})}
    >
      <Form>
        <FormField label="Discount" required name="discount" />
        <Button type="submit" intent="primary">
          Update
        </Button>
      </Form>
    </Formik>
  );
};

const AddFacilityForm = () => {
  const [createFacility] = useCreateFacilityMutation();
  return (
    <Formik
      initialValues={{name: '', description: '', capacity: 0}}
      onSubmit={async (values, actions) => {
        const {name, capacity, description} = values;
        await toast.promise(createFacility({name, capacity, description}), {
          loading: 'Adding facility...',
          success: 'Facility added',
          error: 'Something went wrong',
        });
        actions.setSubmitting(false);
      }}
    >
      <Form>
        <FormField label="Facility Name" required name="name" />
        <FormField label="Facility Capacity" required name="capacity" />
        <FormField label="Facility Description" required name="description" />
        <Button type="submit" intent="primary">
          Add
        </Button>
      </Form>
    </Formik>
  );
};

const UpdateFacilityForm = () => {
  const [updateFacility] = useUpdateFacilityMutation();
  const facilitiesData = useGetFacilitiesQuery();
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | null>(
    null
  );

  if (!facilitiesData.data) return null;
  const facilities = facilitiesData.data;

  const selectedFacility = facilities.find(
    facility => facility.id === selectedFacilityId
  );

  return (
    <>
      <select
        className="border-2 border-black/20 bg-[#fff] p-2 text-black"
        value={selectedFacilityId ?? 'null'}
        onChange={e => setSelectedFacilityId(parseInt(e.target.value))}
      >
        <option value="null" disabled>
          Select a facility
        </option>
        {facilities.map(facility => (
          <option value={facility.id} key={facility.id}>
            {facility.name}
          </option>
        ))}
      </select>
      {selectedFacilityId !== null && (
        <Formik
          enableReinitialize
          initialValues={{
            name: selectedFacility?.name ?? '',
            capacity: selectedFacility?.capacity ?? 0,
            description: selectedFacility?.description ?? '',
          }}
          onSubmit={async (values, actions) => {
            const {name, capacity, description} = values;
            await toast.promise(
              updateFacility({
                id: selectedFacilityId,
                name,
                capacity,
                description,
              }),
              {
                loading: 'Updating facility...',
                success: 'Facility updated',
                error: 'Something went wrong',
              }
            );
            actions.setSubmitting(false);
          }}
        >
          <Form>
            <FormField label="Facility Name" required name="name" />
            <FormField label="Facility Capacity" required name="capacity" />
            <FormField
              label="Facility Description"
              required
              name="description"
            />
            <Button type="submit" intent="primary">
              Update
            </Button>
          </Form>
        </Formik>
      )}
    </>
  );
};

const AddActivityForm = () => {
  const [createActivity] = useCreateFacilityActivityMutation();
  const facilitiesData = useGetFacilitiesQuery();
  const facilities = facilitiesData.data;
  if (!facilities) return null;

  return (
    <Formik
      initialValues={{name: '', duration: 60, capacity: 0, facilityId: 0}}
      onSubmit={async (values, actions) => {
        const {name, capacity, duration, facilityId} = values;
        await toast.promise(
          createActivity({
            name,
            capacity,
            duration,
            facility_id: facilityId,
          }),
          {
            loading: 'Adding new activity...',
            success: 'New activity added',
            error: 'Something went wrong',
          }
        );
        actions.setSubmitting(false);
      }}
      validationSchema={Yup.object({userId: Yup.number().required('Required')})}
    >
      <Form>
        <FormField label="Facility" required name="facilityId" as="select">
          <option value="">Select a facility</option>
          {facilities.map(facility => (
            <option key={facility.id} value={facility.id}>
              {facility.name}
            </option>
          ))}
        </FormField>
        <FormField label="Activity Name" required name="name" />
        <FormField label="Activity Duration" required name="duration" />
        <FormField label="Activity Capacity" required name="capacity" />
        <Button type="submit" intent="primary">
          Add
        </Button>
      </Form>
    </Formik>
  );
};

const UpdateActivityForm = () => {
  const [updateActivity] = useUpdateFacilityActivityMutation();
  const facilitiesData = useGetFacilitiesQuery();
  const activitiesData = useGetFacilityActivitiesQuery();
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(
    null
  );

  const facilities = facilitiesData.data;
  const activities = activitiesData.data;

  if (!facilities || !activities) return null;

  const selectedActivity = activities.find(
    activity => activity.id === selectedActivityId
  );

  return (
    <>
      <select
        className="border-2 border-black/20 bg-[#fff] p-2 text-black"
        value={selectedActivityId ?? 'null'}
        onChange={e => setSelectedActivityId(parseInt(e.target.value))}
      >
        <option value="null" disabled>
          Select activity to amend
        </option>
        {activities.map(activity => {
          return (
            <option value={activity.id} key={activity.id}>
              {activity.name}
            </option>
          );
        })}
      </select>
      {selectedActivityId !== null && (
        <Formik
          enableReinitialize
          initialValues={{
            name: selectedActivity?.name ?? '',
            duration: selectedActivity?.duration ?? 0,
            capacity: selectedActivity?.capacity ?? 0,
            facilityId: selectedActivity?.facility_id ?? -1,
          }}
          onSubmit={async (values, actions) => {
            const {capacity, duration, facilityId, name} = values;
            await toast.promise(
              updateActivity({
                capacity,
                duration,
                facility_id: facilityId,
                name,
                id: selectedActivityId,
              }).unwrap(),
              {
                loading: 'Updating activity',
                success: 'Activity updated',
                error: 'Failed to update activity',
              }
            );
            actions.setSubmitting(false);
          }}
        >
          <Form>
            <FormField label="Facility" required name="facilityId" as="select">
              <option value="">Select a facility</option>
              {facilities.map(facility => (
                <option key={facility.id} value={facility.id}>
                  {facility.name}
                </option>
              ))}
            </FormField>
            <FormField label="Activity Name" required name="name" />
            <FormField label="Activity Duration" required name="duration" />
            <FormField label="Activity Capacity" required name="capacity" />
            <Button type="submit" intent="primary">
              Amend
            </Button>
          </Form>
        </Formik>
      )}
    </>
  );
};
