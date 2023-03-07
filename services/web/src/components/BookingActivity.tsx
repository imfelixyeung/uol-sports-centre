import dayjs from 'dayjs';
import type {FC} from 'react';
import ClockIcon from './Icons/ClockIcon';
import Typography from './Typography';

interface BookingActivityProps {
  title: string;
  datetime: Date;
}

const BookingActivity: FC<BookingActivityProps> = ({title, datetime}) => {
  return (
    <div className="bg-black text-white py-3 px-6 shadow-card">
      <Typography as="h3" styledAs="h2" uppercase>
        Booking Activity
      </Typography>
      <Typography>{title}</Typography>
      <Typography styledAs="subtext" className="flex items-center gap-2">
        <ClockIcon />
        {dayjs(datetime).format('DD/MM/YYYY HH:mm')}
      </Typography>
    </div>
  );
};

export default BookingActivity;
