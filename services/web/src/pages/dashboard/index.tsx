import Link from 'next/link';
import BookingActivity from '~/components/BookingActivity';
import {buttonStyles} from '~/components/Button';
import Card from '~/components/Card';
import PageHero from '~/components/PageHero';
import Seo from '~/components/Seo';
import Typography from '~/components/Typography';

const UserDashboardPage = () => {
  const navSection = (
    <section className="my-16">
      <div className="flex flex-wrap justify-between gap-3">
        <Link href="/dashboard/bookings">
          <Card variant="default" title="Booking" grow />
        </Link>
        <Card variant="alt" title="Memberships" grow />
        <Card variant="red" title="Profile" grow />
      </div>
    </section>
  );

  const availableClassesSection = (
    <section className="my-16">
      <Typography as="h2" styledAs="h1" uppercase className="mb-8">
        {'/// Available Classes'}
      </Typography>
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
      <Typography as="h2" styledAs="h1" uppercase>
        {'/// Upcoming'}
      </Typography>
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
          title="Hello {first_name}!"
          subtitle="Welcome to a sports centre"
        />
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

export default UserDashboardPage;
