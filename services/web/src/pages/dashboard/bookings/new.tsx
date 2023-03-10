import Bookings from '~/components/Bookings';
import PageHero from '~/components/PageHero';
import Seo from '~/components/Seo';
import Typography from '~/components/Typography';

const DashboardBookingsPage = () => {
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
            <div className="mb-8 grid grid-cols-2 gap-3 bg-black p-8 text-white md:grid-cols-3 lg:grid-cols-6">
              <label className="flex grow flex-col">
                <span>Date</span>
                <input type="date" className="p-2 text-black" />
              </label>
              <label className="flex grow flex-col">
                <span>From</span>
                <input type="time" className="p-2 text-black" />
              </label>
              <label className="flex grow flex-col">
                <span>To</span>
                <input type="time" className="p-2 text-black" />
              </label>
              <label className="flex grow flex-col">
                <span>Activity</span>
                <select className="p-2 text-black" defaultValue="">
                  <option value="" hidden>
                    ------
                  </option>
                </select>
              </label>
              <label className="flex grow flex-col">
                <span>Facility</span>
                <select className="p-2 text-black" defaultValue="">
                  <option value="" hidden>
                    ------
                  </option>
                </select>
              </label>
              <label className="flex grow flex-col">
                <span>Places</span>
                <select className="p-2 text-black" defaultValue="">
                  <option value="" hidden>
                    ------
                  </option>
                </select>
              </label>
            </div>
            <Bookings
              title={
                <Typography.h2 styledAs="h1" uppercase>
                  Available Sessions
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
