import Link from 'next/link';
import type {FC} from 'react';
import {useState} from 'react';
import {toast} from 'react-hot-toast';
import BookingActivity from '~/components/BookingActivity';
import BookingFilterForm from '~/components/BookingFilterForm';
import Bookings from '~/components/Bookings';
import {buttonStyles} from '~/components/Button';
import {EditUserRecordForm} from '~/components/EditUserRecordForm';
import PageHero from '~/components/PageHero';
import SelectedBookingsDropdown from '~/components/SelectedBookingsDropdown';
import Typography from '~/components/Typography';
import {withPageAuthRequired} from '~/providers/auth';
import {useAuth} from '~/providers/auth/hooks/useAuth';
import {withUserOnboardingRequired} from '~/providers/user';
import {clearBookings, selectBookings} from '~/redux/features/basket';
import {useAppDispatch, useAppSelector} from '~/redux/hooks';
import {
  useBookBookingMutation,
  useGetAvailableBookingsQuery,
  useGetBookingsQuery,
  useGetUserRecordQuery,
} from '~/redux/services/api';
import type {BookingAvailabilityRequest} from '~/redux/services/types/bookings';

const EmployeePage = () => {
  const {token} = useAuth();
  const [userIdSelected, setUserIdSelected] = useState<number | null>(null);

  const userData = useGetUserRecordQuery(
    {
      userId: userIdSelected!,
      token: token!,
    },
    {
      skip: userIdSelected === null,
    }
  );

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
        <section className="mb-8">
          <Typography.h2>User Id, Enter user id to continue</Typography.h2>
          <label>
            <span>User Id</span>
            <input
              type="number"
              className="border-2 border-black/20 bg-[#fff] p-2 text-black"
              onChange={e => setUserIdSelected(parseInt(e.target.value))}
            />
          </label>
        </section>

        {userIdSelected && userData.currentData ? (
          <>
            <section className="mb-8">
              <Typography.h2>Create booking for customer</Typography.h2>
              <CreateBookingForm userId={userIdSelected} />
            </section>

            <section className="mb-8">
              <Typography.h3>View/Amend booking for customer</Typography.h3>
              <ViewBookingsForm userId={userIdSelected} />
            </section>

            <section className="mb-8">
              <Typography.h3>View/Amend user info</Typography.h3>
              <EditUserRecordForm userId={userIdSelected} />
            </section>
          </>
        ) : (
          <>User not found, they might not have gone through onboarding yet</>
        )}
      </section>
    </div>
  );
};

export default withPageAuthRequired(withUserOnboardingRequired(EmployeePage), {
  rolesAllowed: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
});

const ViewBookingsForm: FC<{
  userId: number;
}> = ({userId}) => {
  const {token} = useAuth();
  const userBookingsData = useGetBookingsQuery({
    token: token!,
    userId: userId,
  });

  const userBookings = userBookingsData.currentData?.bookings;
  if (!userBookings)
    return (
      <div className="bg-white p-3 text-black">
        <Typography.h3>View/Amend booking for customer</Typography.h3>
      </div>
    );

  return (
    <div className="bg-white p-3 text-black">
      {userBookings.length === 0 ? (
        <Typography.p>No bookings found for this user</Typography.p>
      ) : (
        userBookings.map(booking => (
          <BookingActivity
            key={booking.id}
            datetime={new Date(booking.starts)}
            eventId={booking.eventId}
            action={
              <Link
                href={`/dashboard/booking/${booking.id}`}
                className={buttonStyles({intent: 'primary'})}
              >
                View
              </Link>
            }
          />
        ))
      )}
    </div>
  );
};

const CreateBookingForm: FC<{
  userId: number;
}> = ({userId}) => {
  const {token} = useAuth();
  const [filter, setFilter] = useState<BookingAvailabilityRequest>({});
  const [bookBooking] = useBookBookingMutation();
  const availableBookingsData = useGetAvailableBookingsQuery(filter);
  const availableBookings =
    availableBookingsData.currentData?.availableBookings;

  const bookings = useAppSelector(selectBookings);
  const dispatch = useAppDispatch();

  const createBookings = async () => {
    if (!bookings.length) return toast.error('No bookings selected');

    const bookedBookings = bookings.map(booking =>
      toast.promise(
        bookBooking({
          event: booking.event.id,
          starts: booking.starts,
          token: token!,
          user: userId,
        })
          .unwrap()
          .catch(() => new Error('Error creating booking')),
        {
          loading: 'Creating booking',
          success: 'Booking created',
          error: 'Error creating booking',
        }
      )
    );

    const result = await Promise.all(bookedBookings);
    const allSuccess = result.every(booking => !(booking instanceof Error));

    if (allSuccess) dispatch(clearBookings);
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
        title={
          <SelectedBookingsDropdown onBook={() => void createBookings()} />
        }
      />
    </div>
  );
};
