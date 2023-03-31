import {useRouter} from 'next/router';
import {useState} from 'react';
import {toast} from 'react-hot-toast';
import BookingFilterForm from '~/components/BookingFilterForm';
import Bookings from '~/components/Bookings';
import PageHero from '~/components/PageHero';
import SelectedBookingsDropdown from '~/components/SelectedBookingsDropdown';
import Seo from '~/components/Seo';
import {withPageAuthRequired} from '~/providers/auth';
import {useAuth} from '~/providers/auth/hooks/useAuth';
import {withUserOnboardingRequired} from '~/providers/user';
import {selectBookings} from '~/redux/features/basket';
import {useAppDispatch, useAppSelector} from '~/redux/hooks';
import {
  useCreateCheckoutSessionMutation,
  useGetAvailableBookingsQuery,
} from '~/redux/services/api';
import type {
  AvailableBooking,
  BookingAvailabilityRequest,
} from '~/redux/services/types/bookings';

const NewBookingsPage = () => {
  const {token, session} = useAuth();
  const router = useRouter();
  const [filter, setFilter] = useState<BookingAvailabilityRequest>({});
  const availableBookingsData = useGetAvailableBookingsQuery(filter);
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();
  const bookings = useAppSelector(selectBookings);
  const dispatch = useAppDispatch();
  const availableBookings = availableBookingsData.data?.availableBookings;

  if (availableBookingsData.isLoading) return <>Loading...</>;
  if (availableBookingsData.isError || !availableBookings)
    return <>Something went wrong...</>;

  const onBook = async (bookings: AvailableBooking[]) => {
    const checkoutUrl = await toast.promise(
      createCheckoutSession({
        items: bookings.map(booking => ({
          type: 'activity',
          data: {
            event: booking.event.id,
            starts: booking.starts,
          },
        })),
        metadata: {
          successUrl: `${window.location.origin}/dashboard/bookings`,
          cancelUrl: `${window.location.origin}/dashboard/bookings`,
        },
        token: token!,
        user: session!.user.id,
      }).unwrap(),
      {
        loading: 'Creating checkout session...',
        success: 'Checkout session created',
        error: 'Something went wrong...',
      }
    );

    await router.push(checkoutUrl.Checkout);
  };

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

            {availableBookings.length === 0 ? (
              <div className="rounded-sm bg-gray-300 py-8 text-center">
                There are no available bookings based on your filters.
              </div>
            ) : (
              <Bookings
                bookings={availableBookings.map(booking => ({
                  datetime: new Date(booking.starts),
                  capacity: booking.capacity,
                  duration: booking.duration,
                  eventId: booking.event.id,
                  availableBooking: booking,
                  onBook: () => void onBook([booking]),
                }))}
                title={
                  <SelectedBookingsDropdown
                    onBook={() => void onBook(bookings)}
                  />
                }
              />
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default withPageAuthRequired(
  withUserOnboardingRequired(NewBookingsPage)
);
