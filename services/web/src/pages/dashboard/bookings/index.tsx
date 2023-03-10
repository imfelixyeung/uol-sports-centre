import Link from 'next/link';
import Bookings from '~/components/Bookings';
import {buttonStyles} from '~/components/Button';
import PageHero from '~/components/PageHero';
import Seo from '~/components/Seo';
import Typography from '~/components/Typography';

const DashboardBookingsPage = () => {
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

export default DashboardBookingsPage;
