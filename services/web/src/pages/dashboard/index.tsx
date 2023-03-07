import BookingActivity from '~/components/BookingActivity';
import Button from '~/components/Button';
import Card from '~/components/Card';
import Typography from '~/components/Typography';

const UserDashboardPage = () => {
  return (
    <div>
      <header className="container my-16">
        <Typography as="h1" styledAs="display2" uppercase>
          {'Hello {first_name}!'}
        </Typography>
        <Typography as="p" styledAs="subtext" uppercase>
          Welcome to a sports centre
        </Typography>
      </header>
      <div className="bg-white text-black">
        <main className="container py-8 flex gap-3">
          <div>
            <section className="my-16">
              <div className="flex gap-3 justify-between">
                <Card variant="default" title="Booking" grow />
                <Card variant="alt" title="Memberships" grow />
                <Card variant="red" title="Profile" grow />
              </div>
            </section>
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
          </div>
          <section className="my-16 flex flex-col gap-3">
            <Typography as="h2" styledAs="h2" uppercase>
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
        </main>
      </div>
    </div>
  );
};

export default UserDashboardPage;
