import clsx from 'clsx';
import dayjs from 'dayjs';
import localizedFormatPlugin from 'dayjs/plugin/localizedFormat';
import Link from 'next/link';
import type {FC, ReactNode} from 'react';
import {useState} from 'react';
import BookingActivity from '~/components/BookingActivity';
import CalendarIcon from '~/components/Icons/CalendarIcon';
import GridIcon from '~/components/Icons/GridIcon';
import ListIcon from '~/components/Icons/ListIcon';
import {
  addBooking,
  removeBooking,
  selectBookings,
} from '~/redux/features/basket';
import {useAppDispatch, useAppSelector} from '~/redux/hooks';
import type {
  AvailableBooking,
  BookingCapacity,
} from '~/redux/services/types/bookings';
import {datesBetween} from '~/utils/datesBetween';
import Button, {buttonStyles} from './Button';
import IconToggleGroup from './IconToggleGroup';
import ScrollArea from './ScrollArea';
import Typography from './Typography';
dayjs.extend(localizedFormatPlugin);

const availableViews = [
  {id: 'grid', name: 'Grid View', Icon: GridIcon},
  {id: 'list', name: 'List View', Icon: ListIcon},
  {id: 'calendar', name: 'Calendar View', Icon: CalendarIcon},
] as const;
const defaultView: View = 'calendar';
type View = (typeof availableViews)[number]['id'];

interface BookingsProps {
  title: ReactNode;
  bookings: {
    id?: number;
    datetime: Date;
    capacity?: BookingCapacity;
    duration?: number;
    eventId: number;
    availableBooking?: AvailableBooking;
  }[];
}

const Bookings: FC<BookingsProps> = ({title, bookings}) => {
  const [currentView, setCurrentView] = useState<View>(defaultView);
  const dispatch = useAppDispatch();
  const basket = useAppSelector(selectBookings);

  return (
    <>
      <div className="flex flex-wrap justify-between">
        <IconToggleGroup
          items={availableViews.map(view => ({
            Icon: view.Icon,
            value: view.id,
            label: `Switch to ${view.name}`,
          }))}
          value={currentView}
          onValueChange={setCurrentView}
        />
        <div>{title}</div>
      </div>
      <div
        className={clsx(
          'mt-3',
          currentView === 'grid' && 'grid grid-cols-2 gap-3 xl:grid-cols-3',
          currentView === 'list' && 'grid gap-3',
          currentView === 'calendar' && 'hidden'
        )}
      >
        {bookings.map((booking, index) => {
          const {availableBooking, id = null} = booking;

          const inBasket =
            availableBooking &&
            basket.find(
              booking =>
                booking.starts === availableBooking.starts &&
                booking.event.id === availableBooking.event.id
            );
          return (
            <BookingActivity
              key={index}
              datetime={new Date(booking.datetime)}
              capacity={booking.capacity}
              duration={booking.duration}
              eventId={booking.eventId}
              variant={currentView === 'grid' ? 'card' : 'tile'}
              action={
                <>
                  {availableBooking ? (
                    <>
                      <Button intent="primary">Book</Button>
                      {inBasket ? (
                        <Button
                          intent="secondary"
                          onClick={() =>
                            dispatch(removeBooking(availableBooking))
                          }
                        >
                          Remove
                        </Button>
                      ) : (
                        <Button
                          intent="secondary"
                          onClick={() => dispatch(addBooking(availableBooking))}
                        >
                          Add
                        </Button>
                      )}
                    </>
                  ) : null}
                  {id !== null && (
                    <Link
                      href={`/dashboard/booking/${id}`}
                      className={buttonStyles({intent: 'primary'})}
                    >
                      View
                    </Link>
                  )}
                </>
              }
            />
          );
        })}
      </div>
      {currentView === 'calendar' && (
        <div className="mt-3">
          <BookingsCalendarView bookings={bookings} />
        </div>
      )}
    </>
  );
};

const BookingsCalendarView: FC<{
  bookings: {
    id?: number;
    datetime: Date;
    capacity?: BookingCapacity;
    duration?: number;
    eventId: number;
    availableBooking?: AvailableBooking;
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
  const dispatch = useAppDispatch();
  const basket = useAppSelector(selectBookings);

  return (
    <ScrollArea>
      <table className="mb-3 w-full bg-black text-white">
        <thead>
          <tr>
            <th className="sticky left-0 z-50 bg-black p-2">{'Date/Time'}</th>
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
              <th className="sticky left-0 z-50 bg-black p-2">
                {dayjs(date).format('ll')}
              </th>
              {hours.map(hour => {
                const starts = dayjs(date).add(hour, 'hour');
                const bookingsMatching = bookings.filter(
                  booking =>
                    booking.datetime.getTime() === starts.toDate().getTime()
                );
                return (
                  <td key={hour} className="bg-white p-3 align-top text-black">
                    <div className="flex h-full flex-col gap-3">
                      {bookingsMatching.map((booking, index) => {
                        const {availableBooking, id = null} = booking;

                        const inBasket =
                          availableBooking &&
                          basket.find(
                            booking =>
                              booking.starts === availableBooking.starts &&
                              booking.event.id === availableBooking.event.id
                          );

                        return (
                          <BookingActivity
                            key={index}
                            datetime={new Date(booking.datetime)}
                            capacity={booking.capacity}
                            duration={booking.duration}
                            eventId={booking.eventId}
                            variant="tile"
                            action={
                              <>
                                {availableBooking ? (
                                  <>
                                    <Button intent="primary">Book</Button>
                                    {inBasket ? (
                                      <Button
                                        intent="secondary"
                                        onClick={() =>
                                          dispatch(
                                            removeBooking(availableBooking)
                                          )
                                        }
                                      >
                                        Remove
                                      </Button>
                                    ) : (
                                      <Button
                                        intent="secondary"
                                        onClick={() =>
                                          dispatch(addBooking(availableBooking))
                                        }
                                      >
                                        Add
                                      </Button>
                                    )}
                                  </>
                                ) : null}
                                {id !== null && (
                                  <Link
                                    href={`/dashboard/booking/${id}`}
                                    className={buttonStyles({
                                      intent: 'primary',
                                    })}
                                  >
                                    View
                                  </Link>
                                )}
                              </>
                            }
                          />
                        );
                      })}
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
    </ScrollArea>
  );
};

export default Bookings;
