import Link from 'next/link';
import {useState} from 'react';
import {toast} from 'react-hot-toast';
import BookingFilterForm from '~/components/BookingFilterForm';
import Bookings from '~/components/Bookings';
import {buttonStyles} from '~/components/Button';
import PageHero from '~/components/PageHero';
import SelectedBookingsDropdown from '~/components/SelectedBookingsDropdown';
import Typography from '~/components/Typography';
import {withPageAuthRequired} from '~/providers/auth';
import {withUserOnboardingRequired} from '~/providers/user';
import {selectBookings} from '~/redux/features/basket';
import {useAppDispatch, useAppSelector} from '~/redux/hooks';
import {
  useGetAvailableBookingsQuery,
  useGetUserRecordQuery,
} from '~/redux/services/api';
import type {BookingAvailabilityRequest} from '~/redux/services/types/bookings';

const EmployeePage = () => {
  const [userIdSelected, setUserIdSelected] = useState<number | null>(null);
  const userData = useGetUserRecordQuery(userIdSelected!, {
    skip: userIdSelected === null,
  });

  return (
    <div>
      <PageHero title="Employee Dashboard" />
      <Link
        href="/employee/check-in-user"
        className={buttonStyles({intent: 'primary'})}
      >
        Check in user
      </Link>
      <section className="container py-8">
        <Typography.h2>User Id, Enter user id to continue</Typography.h2>
        <label>
          <span>User Id</span>
          <input
            type="number"
            className="border-2 border-black/20 bg-[#fff] p-2 text-black"
            onChange={e => setUserIdSelected(parseInt(e.target.value))}
          />
        </label>
        {userIdSelected && userData.data ? (
          <>
            <Typography.h2>Create booking for customer</Typography.h2>
            <CreateBookingForm />
            <Typography.h3>View/Amend booking for customer</Typography.h3>
            <form action="">Form</form>
          </>
        ) : (
          <>User not found</>
        )}
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

  const bookings = useAppSelector(selectBookings);
  const dispatch = useAppDispatch();

  const createBookings = () => {
    if (!bookings.length) return toast.error('No bookings selected');
  };

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
          eventId: booking.event.id,
        }))}
        title={<SelectedBookingsDropdown onBook={createBookings} />}
      />
    </div>
  );
};
