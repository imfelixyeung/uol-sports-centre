import clsx from 'clsx';
import dayjs from 'dayjs';
import type {FC} from 'react';
import Button from './Button';
import ClockIcon from './Icons/ClockIcon';
import Typography from './Typography';

interface BookingActivityProps {
  variant?: 'card' | 'tile';
  title: string;
  datetime: Date;
  edit?: boolean;
}

const BookingActivity: FC<BookingActivityProps> = ({
  variant = 'card',
  title,
  datetime,
  edit,
}) => {
  return (
    <div
      className={clsx(
        'bg-black text-white py-3 px-6 shadow-card',
        variant && edit && 'relative'
      )}
    >
      <div className="flex gap-6 justify-between">
        <div className={clsx('flex gap-6', variant === 'card' && 'flex-col')}>
          <div>
            <Typography as="h3" uppercase>
              Booking Activity
            </Typography>
            <Typography as="h4" styledAs="subtext" uppercase>
              {title}
            </Typography>
          </div>
          <div
            className={clsx(
              'flex gap-x-3 gap-y-2 flex-wrap',
              variant === 'card' && 'flex-col'
            )}
          >
            <Typography styledAs="subtext" className="flex items-center gap-2">
              <ClockIcon />
              {dayjs(datetime).format('DD/MM/YYYY HH:mm')}
            </Typography>
            <Typography styledAs="subtext" className="flex items-center gap-2">
              <ClockIcon />
              {dayjs(datetime).format('DD/MM/YYYY HH:mm')}
            </Typography>
            <Typography styledAs="subtext" className="flex items-center gap-2">
              <ClockIcon />
              {dayjs(datetime).format('DD/MM/YYYY HH:mm')}
            </Typography>
          </div>
        </div>
        {edit && (
          <Button
            intent="secondary"
            className={clsx(variant === 'card' && 'bottom-3 right-6 absolute')}
          >
            Edit
          </Button>
        )}
      </div>
    </div>
  );
};

export default BookingActivity;
