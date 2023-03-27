import Link from 'next/link';
import Bookings from '~/components/Bookings';
import {buttonStyles} from '~/components/Button';
import PageHero from '~/components/PageHero';
import Seo from '~/components/Seo';
import Typography from '~/components/Typography';
import {withPageAuthRequired} from '~/providers/auth';
import {useAuth} from '~/providers/auth/hooks/useAuth';
import {withUserOnboardingRequired} from '~/providers/user';
import {useGetBookingsQuery} from '~/redux/services/api';

const DashboardBookingsPage = () => {
  const {session} = useAuth();
  const bookingsData = useGetBookingsQuery({
    userId: session?.user.id,
  });

  const bookings = bookingsData.data?.bookings;

  if (!bookings) return null;

  return (
    <>
      <Seo title="Dashboard" />
      <div className="flex grow flex-col">
        <PageHero
          title="Bookings"
          subtitle="View, manage, and create new bookings"
          actions={
            <Link
              className={buttonStyles({intent: 'primary'})}
              href="/dashboard/bookings/new"
            >
              New Booking
            </Link>
          }
        />
        <main className="grow bg-white text-black">
          <div className="container py-8">
            <Bookings
              bookings={bookings.map(booking => ({
                datetime: new Date(booking.starts),
                eventId: booking.eventId,
              }))}
              title={
                <Typography.h2 styledAs="h1" uppercase>
                  Your Bookings
                </Typography.h2>
              }
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default withPageAuthRequired(
  withUserOnboardingRequired(DashboardBookingsPage)
);
