import clsx from 'clsx';
import dayjs from 'dayjs';
import type {FC, ReactNode} from 'react';
import ClockIcon from './Icons/ClockIcon';
import Typography from './Typography';

interface BookingActivityProps {
  variant?: 'card' | 'tile' | 'page';
  name: string;
  facility: string;
  datetime: Date;
  action?: ReactNode;
}

const BookingActivity: FC<BookingActivityProps> = ({
  variant = 'card',
  name,
  datetime,
  action,
  facility,
}) => {
  const metadata = (
    <div
      className={clsx(
        'flex flex-wrap gap-x-3 gap-y-2',
        (variant === 'card' || variant === 'page') && 'flex-col'
      )}
    >
      <Typography styledAs="subtext" className="flex items-center gap-2">
        <ClockIcon className="h-5" />
        {dayjs(datetime).format('DD/MM/YYYY HH:mm')}
      </Typography>
      <Typography styledAs="subtext" className="flex items-center gap-2">
        <ClockIcon className="h-5" />
        {dayjs(datetime).format('DD/MM/YYYY HH:mm')}
      </Typography>
      <Typography styledAs="subtext" className="flex items-center gap-2">
        <ClockIcon className="h-5" />
        {dayjs(datetime).format('DD/MM/YYYY HH:mm')}
      </Typography>
    </div>
  );

  if (variant === 'page')
    return (
      <>
        <Typography as="h1" uppercase>
          Booking Activity
        </Typography>
        <Typography as="h2" uppercase>
          {name}
        </Typography>
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
            <Typography as="h3" uppercase>
              {name}
            </Typography>
            <Typography as="h4" styledAs="subtext" uppercase>
              {facility}
            </Typography>
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
