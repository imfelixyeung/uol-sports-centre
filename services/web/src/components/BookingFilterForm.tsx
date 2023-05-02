import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import {Field, Form, Formik} from 'formik';
import type {FC} from 'react';
import {
  useGetFacilitiesQuery,
  useGetFacilityActivitiesQuery,
} from '~/redux/services/api';
import type {BookingAvailabilityRequest} from '~/redux/services/types/bookings';
import FormikAutoSubmit from './FormikAutoSubmit';

dayjs.extend(utc);
dayjs.extend(timezone);

const BookingFilterForm: FC<{
  onFilterChange: (
    filter: Omit<BookingAvailabilityRequest, 'limit' | 'page'>
  ) => void;
}> = ({onFilterChange}) => {
  const facilitiesData = useGetFacilitiesQuery();
  const activitiesData = useGetFacilityActivitiesQuery();

  const facilities = facilitiesData.data;
  const activities = activitiesData.data;

  if (facilitiesData.isLoading || activitiesData.isLoading)
    return <>Loading...</>;

  if (
    facilitiesData.isError ||
    activitiesData.isError ||
    !facilities ||
    !activities
  )
    return <>Something went wrong...</>;

  const todayStart = dayjs().tz('Europe/London').startOf('day').add(6, 'hour');
  const twoWeeksFromNow = todayStart
    .add(2, 'week')
    .set('hour', 23)
    .set('minute', 59)
    .set('second', 59);
  const todayEnd = todayStart.endOf('day').add(-1, 'hour');
  const minDate = todayStart.format('YYYY-MM-DDTHH:mm');
  const maxDate = twoWeeksFromNow.format('YYYY-MM-DDTHH:mm');
  const defaultEnd = todayEnd.format('YYYY-MM-DDTHH:mm');

  const initialValues: {
    start?: string;
    end?: string;
    activity?: string;
    facility?: string;
  } = {
    start: minDate,
    end: defaultEnd,
    activity: 'default-all',
    facility: 'default-all',
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, actions) => {
        onFilterChange({
          start: values.start ? new Date(values.start).getTime() : undefined,
          end: values.end ? new Date(values.end).getTime() : undefined,
          activityId:
            values.activity === 'default-all'
              ? undefined
              : Number(values.activity),
          facilityId:
            values.facility === 'default-all'
              ? undefined
              : Number(values.facility),
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
            min={minDate}
            max={maxDate}
          />
        </label>
        <label className="flex grow flex-col">
          <span>To</span>
          <Field
            name="end"
            type="datetime-local"
            className="p-2 text-black"
            min={minDate}
            max={maxDate}
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
            <option value="default-all">All</option>
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
            <option value="default-all">All</option>
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
