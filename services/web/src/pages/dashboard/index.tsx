import Link from 'next/link';
import BookingActivity from '~/components/BookingActivity';
import {buttonStyles} from '~/components/Button';
import Card from '~/components/Card';
import PageHero from '~/components/PageHero';
import Seo from '~/components/Seo';
import Typography from '~/components/Typography';
import {withPageAuthRequired} from '~/providers/auth';
import {useAuth} from '~/providers/auth/hooks/useAuth';
import {withUserOnboardingRequired} from '~/providers/user';
import {useUser} from '~/providers/user/hooks/useUser';
import {
  useGetBookingsQuery,
  useGetCustomerPortalQuery,
} from '~/redux/services/api';

const UserDashboardPage = () => {
  const {session, token} = useAuth();
  const {user} = useUser();
  const bookingsData = useGetBookingsQuery({
    userId: session?.user.id,
    token: token!,
  });

  const navSection = (
    <section className="my-16">
      <div className="grid grid-cols-1 justify-between gap-3 lg:grid-cols-3">
        <Link href="/dashboard/bookings" className="grow">
          <Card variant="default" title="Booking" />
        </Link>

        <Link href="/dashboard/profile/membership" className="grow">
          <Card variant="alt" title="Memberships" grow />
        </Link>

        <Link href="/dashboard/profile" className="grow">
          <Card variant="red" title="Profile" />
        </Link>
      </div>
    </section>
  );

  const availableClassesSection = (
    <section className="my-16">
      <Typography.h2 styledAs="h1" uppercase className="mb-8">
        {'/// Available Classes'}
      </Typography.h2>
      <div className="flex flex-wrap gap-3">
        <Card variant="default" title="Card Title" grow />
        <Card variant="default" title="Card Title" grow />
        <Card variant="default" title="Card Title" grow />
        <Card variant="default" title="Card Title" grow />
        <Card variant="default" title="Card Title" grow />
      </div>
    </section>
  );

  const upcomingSection = (
    <section className="my-16 flex flex-col gap-3">
      <Typography.h2 styledAs="h1" desktopStyledAs="h2" uppercase>
        {'/// Upcoming'}
      </Typography.h2>
      {bookingsData.data && bookingsData.data.bookings.length > 0 ? (
        <>
          {bookingsData.data.bookings.map(booking => (
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
          ))}
          <Link
            href="/dashboard/bookings"
            className={buttonStyles({
              intent: 'primary',
              outline: true,
            })}
          >
            More Bookings
          </Link>
        </>
      ) : (
        <>
          <div className="rounded-sm bg-gray-300 p-3">
            No upcoming bookings...
          </div>
          <Link
            href="/dashboard/bookings/new"
            className={buttonStyles({
              intent: 'primary',
              outline: true,
            })}
          >
            New Booking
          </Link>
        </>
      )}
    </section>
  );

  return (
    <>
      <Seo title="Dashboard" />

      <div>
        <PageHero
          title={`Hello ${user?.firstName ?? ''}!`}
          subtitle="Welcome to a sports centre"
        />
        <div className="container my-3 mb-9 flex gap-3">
          {['EMPLOYEE', 'MANAGER', 'ADMIN'].includes(
            session?.user.role ?? ''
          ) && (
            <>
              <Link
                href="/employee"
                className={buttonStyles({
                  intent: 'secondary',
                  className: 'grow',
                })}
              >
                Go to Employee Portal
              </Link>
            </>
          )}
          {['MANAGER', 'ADMIN'].includes(session?.user.role ?? '') && (
            <>
              <Link
                href="/management"
                className={buttonStyles({
                  intent: 'secondary',
                  className: 'grow',
                })}
              >
                Go to Management Portal
              </Link>
            </>
          )}
        </div>
        <main className="bg-white text-black">
          {/* Desktop */}
          <div className="container hidden grid-cols-12 gap-3 py-8 lg:grid">
            <div className="col-span-8">
              {navSection}
              {availableClassesSection}
            </div>
            <div className="col-span-4">{upcomingSection}</div>
          </div>
          {/* Mobile */}
          <div className="container flex-col gap-3 py-8 lg:hidden">
            {navSection}
            {upcomingSection}
            {availableClassesSection}
          </div>
        </main>
      </div>
    </>
  );
};

export default withPageAuthRequired(
  withUserOnboardingRequired(UserDashboardPage)
);
