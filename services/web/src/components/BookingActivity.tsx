import clsx from 'clsx';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import relativeTimePlugin from 'dayjs/plugin/relativeTime';
import type {FC, ReactNode} from 'react';
import type {BookingCapacity} from '~/redux/services/types/bookings';
import CalendarIcon from './Icons/CalendarIcon';
import ClockIcon from './Icons/ClockIcon';
import CounterIcon from './Icons/CounterIcon';
import Typography from './Typography';

dayjs.extend(durationPlugin);
dayjs.extend(relativeTimePlugin);

interface BookingActivityProps {
  variant?: 'card' | 'tile' | 'page';
  name: string;
  facility: string;
  datetime: Date;
  capacity?: BookingCapacity;
  action?: ReactNode;
  duration?: number;
}

const BookingActivity: FC<BookingActivityProps> = ({
  variant = 'card',
  name,
  datetime,
  action,
  facility,
  capacity,
  duration,
}) => {
  const metadata = (
    <div
      className={clsx(
        'flex flex-wrap gap-x-3 gap-y-2',
        (variant === 'card' || variant === 'page') && 'flex-col'
      )}
    >
      <Typography.p styledAs="subtext" className="flex items-center gap-2">
        <CalendarIcon className="h-5" />
        {dayjs(datetime).format('DD/MM/YYYY HH:mm')}
      </Typography.p>
      {capacity && (
        <Typography.p styledAs="subtext" className="flex items-center gap-2">
          <CounterIcon className="h-5" />
          {`${capacity.max - capacity.current}/${capacity.max} slots available`}
        </Typography.p>
      )}
      {duration && (
        <Typography.p styledAs="subtext" className="flex items-center gap-2">
          <ClockIcon className="h-5" />
          {dayjs.duration({minutes: duration}).humanize()}
        </Typography.p>
      )}
    </div>
  );

  if (variant === 'page')
    return (
      <>
        <Typography.h1 uppercase>Booking Activity</Typography.h1>
        <Typography.h2 uppercase>{name}</Typography.h2>
        {metadata}
        <div>{action}</div>
      </>
    );

  return (
    <div
      className={clsx(
        'bg-black py-3 px-6 text-white shadow-card',
        variant && action && 'relative'
      )}
    >
      <div className="flex justify-between gap-6">
        <div className={clsx('flex gap-6', variant === 'card' && 'flex-col')}>
          <div>
            <Typography.h3 uppercase>{name}</Typography.h3>
            <Typography.h4 styledAs="subtext" uppercase>
              {facility}
            </Typography.h4>
          </div>
          {metadata}
        </div>
        {action && (
          <div
            className={clsx(
              'flex items-center gap-3',
              variant === 'card' && 'absolute bottom-3 right-6'
            )}
          >
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingActivity;
