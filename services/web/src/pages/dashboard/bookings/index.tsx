import clsx from 'clsx';
import {useState} from 'react';
import BookingActivity from '~/components/BookingActivity';
import Button from '~/components/Button';
import PageHero from '~/components/PageHero';
import Seo from '~/components/Seo';
import Typography from '~/components/Typography';

const DashboardBookingsPage = () => {
  const [currentView, setCurrentView] = useState<'grid' | 'list' | 'calendar'>(
    'grid'
  );

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
                <button
                  className={clsx(
                    'aspect-square h-8 grid place-items-center cursor-pointer',
                    currentView === 'grid' ? 'bg-primary' : 'bg-white'
                  )}
                  onClick={() => setCurrentView('grid')}
                >
                  G
                </button>
                <button
                  className={clsx(
                    'aspect-square h-8 grid place-items-center cursor-pointer',
                    currentView === 'list' ? 'bg-primary' : 'bg-white'
                  )}
                  onClick={() => setCurrentView('list')}
                >
                  L
                </button>
                <button
                  className={clsx(
                    'aspect-square h-8 grid place-items-center cursor-pointer',
                    currentView === 'calendar' ? 'bg-primary' : 'bg-white'
                  )}
                  onClick={() => setCurrentView('calendar')}
                >
                  C
                </button>
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
