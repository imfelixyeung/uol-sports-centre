import * as Popover from '@radix-ui/react-popover';
import type {FC} from 'react';
import {
  clearBookings,
  removeBooking,
  selectBookings,
} from '~/redux/features/basket';
import {useAppDispatch, useAppSelector} from '~/redux/hooks';
import BookingActivity from './BookingActivity';
import Button from './Button';
import ChevronDownIcon from './Icons/ChevronDownIcon';
import Typography from './Typography';

const SelectedBookingsDropdown: FC<{
  onBook?: () => void;
}> = ({onBook}) => {
  const bookings = useAppSelector(selectBookings);
  const dispatch = useAppDispatch();

  return (
    <>
      <Popover.Root>
        <Popover.Trigger asChild>
          <div>
            <Button intent="primary" outline className="gap-3">
              <span>Selected ({bookings.length})</span>
              <ChevronDownIcon className="h-3" />
            </Button>
          </div>
        </Popover.Trigger>
        <Popover.Anchor />
        <Popover.Portal>
          <Popover.Content
            className="z-50 max-w-[90vw] bg-black/90 p-3 ring-4 ring-inset ring-black"
            collisionPadding={8}
          >
            <div className="flex flex-col gap-3">
              {bookings.map((booking, index) => (
                <BookingActivity
                  key={index}
                  datetime={new Date(booking.starts)}
                  capacity={booking.capacity}
                  duration={booking.duration}
                  eventId={booking.event.id}
                  variant="tile"
                  action={
                    <Button
                      intent="secondary"
                      onClick={() => dispatch(removeBooking(booking))}
                    >
                      Remove
                    </Button>
                  }
                />
              ))}
              {bookings.length === 0 && (
                <Typography.p>No bookings selected</Typography.p>
              )}
            </div>
            <div className="mt-3 flex justify-between gap-3">
              <Button
                intent="secondary"
                onClick={() => dispatch(clearBookings())}
              >
                Clear
              </Button>
              <Button intent="primary" onClick={onBook}>
                Book Selected
              </Button>
            </div>
            {/* <Popover.Close /> */}
            <Popover.Arrow />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </>
  );
};

export default SelectedBookingsDropdown;
