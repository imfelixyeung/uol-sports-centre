import clsx from 'clsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ms from 'ms';
import type {FC} from 'react';
import Seo from '~/components/Seo';
import {StatusOverview} from '~/components/Status';
import Typography from '~/components/Typography';
import {useGetStatusReportQuery} from '~/redux/services/api';
import type {ServiceStatus} from '~/redux/services/types/status';
dayjs.extend(relativeTime);

const StatusPage = () => {
  const statusReportData = useGetStatusReportQuery(undefined, {
    pollingInterval: ms('1m'),
  });
  if (statusReportData.isLoading) return <div>Loading...</div>;
  if (statusReportData.isError) return <div>Error... Try again later</div>;
  if (!statusReportData.data) return <div>No data...</div>;

  const report = statusReportData.data.data;

  return (
    <>
      <Seo title="Status" />
      <div className="container my-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Typography.h1>Service Status</Typography.h1>
          <StatusOverview />
        </div>
        <div className="mt-8 flex flex-wrap gap-3 [&>*]:grow">
          {report.map(serviceStatus => {
            return (
              <ServerStatusDisplay
                serviceStatus={serviceStatus}
                key={serviceStatus.service}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

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

export default StatusPage;
