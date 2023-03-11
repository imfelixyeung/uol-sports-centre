import clsx from 'clsx';
import type {FC, ReactNode} from 'react';
import {useState} from 'react';
import BookingActivity from '~/components/BookingActivity';
import CalendarIcon from '~/components/Icons/CalendarIcon';
import GridIcon from '~/components/Icons/GridIcon';
import ListIcon from '~/components/Icons/ListIcon';
import Button from './Button';
import IconToggleGroup from './IconToggleGroup';

const availableViews = [
  {id: 'grid', name: 'Grid View', Icon: GridIcon},
  {id: 'list', name: 'List View', Icon: ListIcon},
  {id: 'calendar', name: 'Calendar View', Icon: CalendarIcon},
] as const;
const defaultView: View = 'grid';
type View = (typeof availableViews)[number]['id'];

interface BookingsProps {
  title: ReactNode;
}

const Bookings: FC<BookingsProps> = ({title}) => {
  const [currentView, setCurrentView] = useState<View>(defaultView);

  return (
    <>
      <div className="flex flex-wrap justify-between">
        <div>{title}</div>
        <IconToggleGroup
          items={availableViews.map(view => ({
            Icon: view.Icon,
            value: view.id,
            label: `Switch to ${view.name}`,
          }))}
          value={currentView}
          onValueChange={setCurrentView}
        />
      </div>
      <div
        className={clsx(
          'mt-3',
          currentView === 'grid' && 'grid grid-cols-2 gap-3 xl:grid-cols-3',
          currentView === 'list' && 'grid gap-3',
          currentView === 'calendar' && 'hidden'
        )}
      >
        <BookingActivity
          datetime={new Date('2023-01-01 00:00')}
          name="Facility Name"
          facility="Facility"
          variant={currentView === 'grid' ? 'card' : 'tile'}
          action={<Button intent="secondary">Edit</Button>}
        />
        <BookingActivity
          datetime={new Date('2023-01-01 00:00')}
          name="Facility Name"
          facility="Facility"
          variant={currentView === 'grid' ? 'card' : 'tile'}
          action={<Button intent="secondary">Edit</Button>}
        />
        <BookingActivity
          datetime={new Date('2023-01-01 00:00')}
          name="Facility Name"
          facility="Facility"
          variant={currentView === 'grid' ? 'card' : 'tile'}
          action={<Button intent="secondary">Edit</Button>}
        />
        <BookingActivity
          datetime={new Date('2023-01-01 00:00')}
          name="Facility Name"
          facility="Facility"
          variant={currentView === 'grid' ? 'card' : 'tile'}
          action={<Button intent="secondary">Edit</Button>}
        />
        <BookingActivity
          datetime={new Date('2023-01-01 00:00')}
          name="Facility Name"
          facility="Facility"
          variant={currentView === 'grid' ? 'card' : 'tile'}
          action={<Button intent="secondary">Edit</Button>}
        />
        <BookingActivity
          datetime={new Date('2023-01-01 00:00')}
          name="Facility Name"
          facility="Facility"
          variant={currentView === 'grid' ? 'card' : 'tile'}
          action={<Button intent="secondary">Edit</Button>}
        />
      </div>
      {currentView === 'calendar' && (
        <div className="mt-3 min-h-[16rem] bg-black" />
      )}
    </>
  );
};

export default Bookings;
