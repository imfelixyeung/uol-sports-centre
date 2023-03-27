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

const UserDashboardPage = () => {
  const {session} = useAuth();
  const {user} = useUser();

  const navSection = (
    <section className="my-16">
      <div className="flex flex-wrap justify-between gap-3">
        <Link href="/dashboard/bookings" className="grow">
          <Card variant="default" title="Booking" />
        </Link>
        <Card variant="alt" title="Memberships" grow />
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
      <BookingActivity
        datetime={new Date('2023-01-01 00:00')}
        name="Booking Facility"
        facility="Facility Name"
      />
      <BookingActivity
        datetime={new Date('2023-01-01 00:00')}
        name="Booking Facility"
        facility="Facility Name"
      />
      <BookingActivity
        datetime={new Date('2023-01-01 00:00')}
        name="Booking Facility"
        facility="Facility Name"
      />

      <Link
        href="/dashboard/bookings"
        className={buttonStyles({
          intent: 'primary',
          outline: true,
        })}
      >
        More Bookings
      </Link>
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
        <div className="container my-3 flex flex-col gap-3">
          {['EMPLOYEE', 'MANAGER', 'ADMIN'].includes(
            session?.user.role ?? ''
          ) && (
            <>
              <Link href="/employee">Go to Employee Portal</Link>
            </>
          )}
          {['MANAGER', 'ADMIN'].includes(session?.user.role ?? '') && (
            <>
              <Link href="/management">Go to Management Portal</Link>
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
