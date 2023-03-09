import clsx from 'clsx';
import {useState} from 'react';
import BookingActivity from '~/components/BookingActivity';
import Button from '~/components/Button';
import CalendarIcon from '~/components/Icons/CalendarIcon';
import GridIcon from '~/components/Icons/GridIcon';
import ListIcon from '~/components/Icons/ListIcon';
import PageHero from '~/components/PageHero';
import Seo from '~/components/Seo';
import Typography from '~/components/Typography';

const availableViews = [
  {id: 'grid', name: 'Grid View', Icon: GridIcon},
  {id: 'list', name: 'List View', Icon: ListIcon},
  {id: 'calendar', name: 'Calendar View', Icon: CalendarIcon},
] as const;
const defaultView: View = 'grid';
type View = (typeof availableViews)[number]['id'];

const DashboardBookingsPage = () => {
  const [currentView, setCurrentView] = useState<View>(defaultView);

  return (
    <>
      <Seo title="Dashboard" />
      <div className="grow flex flex-col">
        <PageHero
          title="Bookings"
          subtitle="View, manage, and create new bookings"
          actions={<Button intent="primary">New Booking</Button>}
        />
        <main className="bg-white text-black grow">
          <div className="container py-8">
            <div className="flex flex-wrap justify-between">
              <Typography as="h2" styledAs="h1" uppercase>
                Your Bookings
              </Typography>
              <div className="bg-black p-2 flex gap-2 items-center">
                {availableViews.map((view, index) => (
                  <button
                    key={index}
                    className={clsx(
                      'aspect-square h-8 grid place-items-center cursor-pointer',
                      currentView === view.id ? 'bg-primary' : 'bg-white'
                    )}
                    aria-label={`Switch to ${view.name}`}
                    title={`Switch to ${view.name}`}
                    onClick={() => setCurrentView(view.id)}
                  >
                    <view.Icon className="h-5 aspect-square" />
                  </button>
                ))}
              </div>
            </div>
            <div
              className={clsx(
                'mt-3',
                currentView === 'grid' &&
                  'grid gap-3 grid-cols-2 xl:grid-cols-3',
                currentView === 'list' && 'grid gap-3',
                currentView === 'calendar' && 'hidden'
              )}
            >
              <BookingActivity
                datetime={new Date('2023-01-01 00:00')}
                title="Booking Facility"
                variant={currentView === 'grid' ? 'card' : 'tile'}
                edit
              />
              <BookingActivity
                datetime={new Date('2023-01-01 00:00')}
                title="Booking Facility"
                variant={currentView === 'grid' ? 'card' : 'tile'}
                edit
              />
              <BookingActivity
                datetime={new Date('2023-01-01 00:00')}
                title="Booking Facility"
                variant={currentView === 'grid' ? 'card' : 'tile'}
                edit
              />
              <BookingActivity
                datetime={new Date('2023-01-01 00:00')}
                title="Booking Facility"
                variant={currentView === 'grid' ? 'card' : 'tile'}
                edit
              />
              <BookingActivity
                datetime={new Date('2023-01-01 00:00')}
                title="Booking Facility"
                variant={currentView === 'grid' ? 'card' : 'tile'}
                edit
              />
              <BookingActivity
                datetime={new Date('2023-01-01 00:00')}
                title="Booking Facility"
                variant={currentView === 'grid' ? 'card' : 'tile'}
                edit
              />
            </div>
            {currentView === 'calendar' && (
              <div className="min-h-[16rem] bg-black mt-3" />
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardBookingsPage;
