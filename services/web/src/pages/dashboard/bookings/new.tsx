import Bookings from '~/components/Bookings';
import PageHero from '~/components/PageHero';
import Seo from '~/components/Seo';
import Typography from '~/components/Typography';

const DashboardBookingsPage = () => {
  return (
    <>
      <Seo title="Dashboard" />
      <div className="grow flex flex-col">
        <PageHero
          title="New Booking"
          subtitle="View, manage, and create new bookings"
        />
        <main className="bg-white text-black grow">
          <div className="container py-8">
            <div className="bg-black p-8 mb-8 text-white grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              <label className="flex flex-col grow">
                <span>Date</span>
                <input type="date" className="text-black p-2" />
              </label>
              <label className="flex flex-col grow">
                <span>From</span>
                <input type="time" className="text-black p-2" />
              </label>
              <label className="flex flex-col grow">
                <span>To</span>
                <input type="time" className="text-black p-2" />
              </label>
              <label className="flex flex-col grow">
                <span>Activity</span>
                <select className="text-black p-2" defaultValue="">
                  <option value="" hidden>
                    ------
                  </option>
                </select>
              </label>
              <label className="flex flex-col grow">
                <span>Facility</span>
                <select className="text-black p-2" defaultValue="">
                  <option value="" hidden>
                    ------
                  </option>
                </select>
              </label>
              <label className="flex flex-col grow">
                <span>Places</span>
                <select className="text-black p-2" defaultValue="">
                  <option value="" hidden>
                    ------
                  </option>
                </select>
              </label>
            </div>
            <Bookings
              title={
                <Typography as="h2" styledAs="h1" uppercase>
                  Available Sessions
                </Typography>
              }
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardBookingsPage;
