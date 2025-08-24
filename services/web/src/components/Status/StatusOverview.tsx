import ms from 'ms';
import Link from 'next/link';
import type {FC} from 'react';
import {useMemo} from 'react';
import {mockStatuses} from '~/data/mock';
import {env} from '~/env.mjs';
import {useGetStatusReportQuery} from '~/redux/services/api';

const StatusOverview: FC = () => {
  const statusReportData = useGetStatusReportQuery(undefined, {
    pollingInterval: ms('1m'),
    skip: !!env.NEXT_PUBLIC_USE_MOCK_DATA,
  });

  const statusReport = env.NEXT_PUBLIC_USE_MOCK_DATA
    ? mockStatuses
    : statusReportData.data;

  const status = useMemo(() => {
    if (statusReportData.isLoading) return 'Loading...';
    if (
      (!env.NEXT_PUBLIC_USE_MOCK_DATA && statusReportData.isError) ||
      !statusReport
    )
      return 'Something went wrong...';
    const report = statusReport.data;

    const healthy = report.every(service => service.status === 'up');
    if (healthy) return 'Phenomenal';

    const degraded = report.every(
      service => service.status === 'up' || service.status === 'degraded'
    );
    if (degraded) return 'Degraded';

    return 'Some Services Unavailable';
  }, [statusReportData]);

  return (
    <Link
      href="/status"
      className="rounded-md border-white px-3 py-2 ring-1 ring-inset ring-white"
    >
      {`Status: ${status}`}
    </Link>
  );
};

export default StatusOverview;
