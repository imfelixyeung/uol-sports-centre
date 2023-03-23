import {Field, Form, Formik} from 'formik';
import type {FC} from 'react';
import {useState} from 'react';
import BookingActivity from '~/components/BookingActivity';
import Bookings from '~/components/Bookings';
import Button from '~/components/Button';
import FormikAutoSubmit from '~/components/FormikAutoSubmit';
import PageHero from '~/components/PageHero';
import Seo from '~/components/Seo';
import {withPageAuthRequired} from '~/providers/auth';
import {withUserOnboardingRequired} from '~/providers/user';
import {removeBooking, selectBookings} from '~/redux/features/basket';
import {useAppDispatch, useAppSelector} from '~/redux/hooks';
import {
  useGetAvailableBookingsQuery,
  useGetFacilitiesQuery,
  useGetFacilityActivitiesQuery,
} from '~/redux/services/api';
import type {BookingAvailabilityRequest} from '~/redux/services/types/bookings';

const NewBookingsPage = () => {
  const [filter, setFilter] = useState<BookingAvailabilityRequest>({});
  const availableBookingsData = useGetAvailableBookingsQuery(filter);
  const availableBookings = availableBookingsData.data?.availableBookings;

  if (!availableBookings) return null; // TODO: handle loading, error states

  return (
    <>
      <Seo title="Dashboard" />
      <div className="flex grow flex-col">
        <PageHero
          title="New Booking"
          subtitle="View, manage, and create new bookings"
        />
        <main className="grow bg-white text-black">
          <div className="container py-8">
            <BookingFilterForm onFilterChange={setFilter} />
            <Bookings
              bookings={availableBookings.map(booking => ({
                datetime: new Date(booking.starts),
                capacity: booking.capacity,
                duration: booking.duration,
                name: booking.event.name,
                availableBooking: booking,
              }))}
              title={<SelectedBookingsDropdown />}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default withPageAuthRequired(
  withUserOnboardingRequired(NewBookingsPage)
);

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

  const initialValues: {
    start?: string;
    end?: string;
    activity?: number;
    facility?: number;
  } = {};

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
          />
        </label>
        <label className="flex grow flex-col">
          <span>To</span>
          <Field name="end" type="datetime-local" className="p-2 text-black" />
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

const SelectedBookingsDropdown: FC = () => {
  const bookings = useAppSelector(selectBookings);
  const dispatch = useAppDispatch();
  return (
    <>
      {bookings.map((booking, index) => (
        <BookingActivity
          key={index}
          datetime={new Date(booking.starts)}
          capacity={booking.capacity}
          duration={booking.duration}
          name={booking.event.name}
          facility="Facility"
          variant="tile"
          action={
            <Button
              intent="secondary"
              onClick={() => dispatch(removeBooking(booking))}
            >
              Remove
            </Button>
          }
        />
      ))}
    </>
  );
};
