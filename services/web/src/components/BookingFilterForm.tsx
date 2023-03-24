import dayjs from 'dayjs';
import {Field, Form, Formik} from 'formik';
import type {FC} from 'react';
import {
  useGetFacilitiesQuery,
  useGetFacilityActivitiesQuery,
} from '~/redux/services/api';
import type {BookingAvailabilityRequest} from '~/redux/services/types/bookings';
import FormikAutoSubmit from './FormikAutoSubmit';

const BookingFilterForm: FC<{
  onFilterChange: (
    filter: Omit<BookingAvailabilityRequest, 'limit' | 'page'>
  ) => void;
}> = ({onFilterChange}) => {
  const facilitiesData = useGetFacilitiesQuery();
  const activitiesData = useGetFacilityActivitiesQuery();

  const facilities = facilitiesData.data;
  const activities = activitiesData.data;

  if (!facilities || !activities) return null; // TODO: handle loading, error states

  const now = dayjs().set('hour', 0).set('minute', 0).set('second', 0);
  const twoWeeksFromNow = now
    .add(2, 'week')
    .set('hour', 23)
    .set('minute', 59)
    .set('second', 59);
  const defaultStart = now.format('YYYY-MM-DDTHH:mm');
  const defaultEnd = twoWeeksFromNow.format('YYYY-MM-DDTHH:mm');

  const initialValues: {
    start?: string;
    end?: string;
    activity?: number;
    facility?: number;
  } = {
    start: defaultStart,
    end: defaultEnd,
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, actions) => {
        onFilterChange({
          start: values.start ? new Date(values.start).getTime() : undefined,
          end: values.end ? new Date(values.end).getTime() : undefined,
          activityId: values.activity,
          facilityId: values.facility,
        });
        actions.setSubmitting(false);
      }}
    >
      <Form className="mb-8 grid grid-cols-2 gap-3 bg-black p-8 text-white lg:grid-cols-4">
        <FormikAutoSubmit />
        <label className="flex grow flex-col">
          <span>From</span>
          <Field
            name="start"
            type="datetime-local"
            className="p-2 text-black"
            min={defaultStart}
            max={defaultEnd}
          />
        </label>
        <label className="flex grow flex-col">
          <span>To</span>
          <Field
            name="end"
            type="datetime-local"
            className="p-2 text-black"
            min={defaultStart}
            max={defaultEnd}
          />
        </label>
        <label className="flex grow flex-col">
          <span>Activity</span>
          <Field
            name="activity"
            as="select"
            className="p-2 text-black"
            defaultValue=""
          >
            <option value="" hidden>
              ------
            </option>
            {activities.map(activity => (
              <option key={activity.id} value={activity.id}>
                {activity.name}
              </option>
            ))}
          </Field>
        </label>
        <label className="flex grow flex-col">
          <span>Facility</span>
          <Field
            name="facility"
            as="select"
            className="p-2 text-black"
            defaultValue=""
          >
            <option value="" hidden>
              ------
            </option>
            {facilities.map(facility => (
              <option key={facility.id} value={facility.id}>
                {facility.name}
              </option>
            ))}
          </Field>
        </label>
      </Form>
    </Formik>
  );
};

export default BookingFilterForm;
