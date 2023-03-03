import clsx from 'clsx';
import {useGetStatusReportQuery} from '~/redux/services/api';

const StatusPage = () => {
  const statusReportData = useGetStatusReportQuery();
  if (statusReportData.isLoading) return <div>Loading...</div>;
  if (statusReportData.isError) return <div>Error... Try again later</div>;
  if (!statusReportData.data) return <div>No data...</div>;

  const report = statusReportData.data.data;

  return (
    <div className="space-y-3">
      {report.map(serviceStatus => {
        const {service, status, statusCode, timestamp} = serviceStatus;
        return (
          <div
            key={service}
            className={clsx(
              'p-3 bg-white/50',
              status === 'up'
                ? 'text-green-600'
                : status === 'down'
                ? 'text-red-600'
                : 'text-amber-600'
            )}
          >
            <h3>{service}</h3>
            <p>Status: {status}</p>
            <p>Code: {statusCode}</p>
            <p>Last checked: {new Date(timestamp).toLocaleString()}</p>
          </div>
        );
      })}
    </div>
  );
};

export default StatusPage;
