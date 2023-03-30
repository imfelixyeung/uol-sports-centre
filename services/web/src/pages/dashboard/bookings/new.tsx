import {useState} from 'react';
import BookingFilterForm from '~/components/BookingFilterForm';
import Bookings from '~/components/Bookings';
import PageHero from '~/components/PageHero';
import SelectedBookingsDropdown from '~/components/SelectedBookingsDropdown';
import Seo from '~/components/Seo';
import {withPageAuthRequired} from '~/providers/auth';
import {withUserOnboardingRequired} from '~/providers/user';
import {useGetAvailableBookingsQuery} from '~/redux/services/api';
import type {BookingAvailabilityRequest} from '~/redux/services/types/bookings';

const NewBookingsPage = () => {
  const [filter, setFilter] = useState<BookingAvailabilityRequest>({});
  const availableBookingsData = useGetAvailableBookingsQuery(filter);
  const availableBookings = availableBookingsData.data?.availableBookings;

  if (availableBookingsData.isLoading) return <>Loading...</>;
  if (availableBookingsData.isError || !availableBookings)
    return <>Something went wrong...</>;

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
                }))}
                title={<SelectedBookingsDropdown />}
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
