import clsx from 'clsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type {FC} from 'react';
import type {ServiceStatus} from '~/redux/services/types/status';
import Typography from '../Typography';
dayjs.extend(relativeTime);

const ServerStatusDisplay: FC<{
  serviceStatus: ServiceStatus;
}> = ({serviceStatus}) => {
  const {service, status, statusCode, timestamp} = serviceStatus;
  return (
    <section
      className={clsx(
        'border-l-8 bg-white p-4 text-black',
        status === 'up'
          ? 'border-green-600'
          : status === 'down'
          ? 'border-red-600'
          : 'border-amber-600'
      )}
    >
      <Typography.h2>{service}</Typography.h2>
      <Typography.p styledAs="subtext">Status: {status}</Typography.p>
      <Typography.p styledAs="subtext">Code: {statusCode}</Typography.p>
      <Typography.p styledAs="subtext">
        Last checked:{' '}
        <span title={dayjs(timestamp).format('DD/MM/YYYY, HH:mm:ss')}>
          {dayjs(timestamp).fromNow()}
        </span>
      </Typography.p>
    </section>
  );
};

export default ServerStatusDisplay;
