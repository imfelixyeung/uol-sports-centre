import {useState} from 'react';
import BookingFilterForm from '~/components/BookingFilterForm';
import Bookings from '~/components/Bookings';
import PageHero from '~/components/PageHero';
import SelectedBookingsDropdown from '~/components/SelectedBookingsDropdown';
import Typography from '~/components/Typography';
import {withPageAuthRequired} from '~/providers/auth';
import {withUserOnboardingRequired} from '~/providers/user';
import {useGetAvailableBookingsQuery} from '~/redux/services/api';
import type {BookingAvailabilityRequest} from '~/redux/services/types/bookings';

const EmployeePage = () => {
  return (
    <div>
      <PageHero title="Employee Dashboard" />
      <section className="container py-8">
        <Typography.h2>Create booking for customer</Typography.h2>
        <CreateBookingForm />
        <Typography.h3>View/Amend booking for customer</Typography.h3>
        <form action="">Form</form>
      </section>
    </div>
  );
};

export default withPageAuthRequired(withUserOnboardingRequired(EmployeePage), {
  rolesAllowed: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
});

const CreateBookingForm = () => {
  const [filter, setFilter] = useState<BookingAvailabilityRequest>({});
  const availableBookingsData = useGetAvailableBookingsQuery(filter);
  const availableBookings = availableBookingsData.data?.availableBookings;

  if (!availableBookings) return null; // TODO: handle loading, error states
  return (
    <div className="bg-white p-3 text-black">
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
  );
};
