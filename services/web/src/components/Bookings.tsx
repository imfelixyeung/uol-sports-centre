import clsx from 'clsx';
import dayjs from 'dayjs';
import localizedFormatPlugin from 'dayjs/plugin/localizedFormat';
import type {FC, ReactNode} from 'react';
import {useState} from 'react';
import BookingActivity from '~/components/BookingActivity';
import CalendarIcon from '~/components/Icons/CalendarIcon';
import GridIcon from '~/components/Icons/GridIcon';
import ListIcon from '~/components/Icons/ListIcon';
import type {BookingCapacity} from '~/redux/services/types/bookings';
import {datesBetween} from '~/utils/datesBetween';
import Button from './Button';
import IconToggleGroup from './IconToggleGroup';
import Typography from './Typography';
dayjs.extend(localizedFormatPlugin);

const availableViews = [
  {id: 'grid', name: 'Grid View', Icon: GridIcon},
  {id: 'list', name: 'List View', Icon: ListIcon},
  {id: 'calendar', name: 'Calendar View', Icon: CalendarIcon},
] as const;
const defaultView: View = 'grid';
type View = (typeof availableViews)[number]['id'];

interface BookingsProps {
  title: ReactNode;
  bookings: {
    datetime: Date;
    capacity?: BookingCapacity;
    duration: number;
    name: string;
  }[];
}

const Bookings: FC<BookingsProps> = ({title, bookings}) => {
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
        {bookings.map((booking, index) => (
          <BookingActivity
            key={index}
            datetime={new Date(booking.datetime)}
            capacity={booking.capacity}
            duration={booking.duration}
            name={booking.name}
            facility="Facility"
            variant={currentView === 'grid' ? 'card' : 'tile'}
            action={<Button intent="secondary">Edit</Button>}
          />
        ))}
      </div>
      {currentView === 'calendar' && (
        <div className="mt-3 bg-black text-white">
          <BookingsCalendarView bookings={bookings} />
        </div>
      )}
    </>
  );
};

const BookingsCalendarView: FC<{
  bookings: {
    datetime: Date;
    capacity?: BookingCapacity;
    duration: number;
    name: string;
  }[];
}> = ({bookings}) => {
  const calendarStart = Math.min(
    ...bookings.map(booking => booking.datetime.getTime())
  );
  const calendarEnd = Math.max(
    ...bookings.map(booking => booking.datetime.getTime())
  );

  const dates = datesBetween(new Date(calendarStart), new Date(calendarEnd));
  const hours = Array.from({length: 24}, (_, index) => index);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="p-2">{'Date/Time'}</th>
            {hours.map(hour => (
              <th key={hour} className="p-2">
                {hour}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dates.map(date => (
            <tr key={date.toISOString()}>
              <th>{dayjs(date).format('ll')}</th>
              {hours.map(hour => {
                const starts = dayjs(date).add(hour, 'hour');
                const bookingsMatching = bookings.filter(
                  booking =>
                    booking.datetime.getTime() === starts.toDate().getTime()
                );
                return (
                  <td key={hour} className="bg-white p-3 text-black">
                    <div className="flex flex-col gap-3">
                      {bookingsMatching.map((booking, index) => (
                        <BookingActivity
                          key={index}
                          datetime={new Date(booking.datetime)}
                          capacity={booking.capacity}
                          duration={booking.duration}
                          name={booking.name}
                          facility="Facility"
                          variant="tile"
                          action={<Button intent="secondary">Edit</Button>}
                        />
                      ))}
                      {bookingsMatching.length === 0 && (
                        <Typography.p styledAs="smallP">
                          No bookings available at {starts.format('lll')}
                        </Typography.p>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Bookings;
