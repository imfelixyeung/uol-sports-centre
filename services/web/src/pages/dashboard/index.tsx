import BookingActivity from '~/components/BookingActivity';
import Button from '~/components/Button';
import Card from '~/components/Card';
import Typography from '~/components/Typography';

const UserDashboardPage = () => {
  const navSection = (
    <section className="my-16">
      <div className="flex gap-3 justify-between flex-wrap">
        <Card variant="default" title="Booking" grow />
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
        title="Booking Facility"
      />
      <BookingActivity
        datetime={new Date('2023-01-01 00:00')}
        title="Booking Facility"
      />
      <BookingActivity
        datetime={new Date('2023-01-01 00:00')}
        title="Booking Facility"
      />
      <Button intent="primary" outline>
        Button
      </Button>
    </section>
  );

  return (
    <div>
      <header className="container my-16">
        <Typography as="h1" styledAs="display2" uppercase className="mb-3">
          {'Hello {first_name}!'}
        </Typography>
        <Typography as="p" styledAs="subtext" uppercase>
          Welcome to a sports centre
        </Typography>
      </header>
      <main className="bg-white text-black">
        {/* Desktop */}
        <div className="container py-8 gap-3 hidden lg:grid grid-cols-12">
          <div className="col-span-8">
            {navSection}
            {availableClassesSection}
          </div>
          <div className="col-span-4">{upcomingSection}</div>
        </div>

        {/* Mobile */}
        <div className="container py-8 flex-col gap-3 lg:hidden">
          {navSection}
          {upcomingSection}
          {availableClassesSection}
        </div>
      </main>
    </div>
  );
};

export default UserDashboardPage;
