import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import type {FC} from 'react';
import {Bar} from 'react-chartjs-2';
import {useAuth} from '~/providers/auth/hooks/useAuth';
import {useGetSalesSummaryQuery} from '~/redux/services/api';
import type {ProductType} from '~/redux/services/types/payments';
import {productTypes} from '~/redux/services/types/payments';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesGraphs: FC = () => {
  return (
    <>
      {productTypes.map(productType => (
        <SalesGraph key={productType} productType={productType} />
      ))}
    </>
  );
};

const SalesGraph: FC<{
  productType: ProductType;
}> = ({productType}) => {
  const {token} = useAuth();

  const salesData = useGetSalesSummaryQuery({
    productType,
    token: token!,
  });

  if (salesData.isLoading) return <>Loading... {productType}</>;
  if (!salesData.data)
    return <>Something went wrong while loading {productType}</>;

  const sales = salesData.data;

  if (sales.length === 0) return <p>No data for {productType} yet</p>;

  return (
    <div>
      <b>{productType}</b>
      <Bar
        className="bg-white"
        options={{
          scales: {
            yUnitsSold: {
              type: 'linear',
              display: true,
              position: 'left',
              axis: 'y',
            },
            yTotalSales: {
              type: 'linear',
              display: true,
              position: 'right',
              axis: 'y',
            },
          },
        }}
        data={{
          labels: sales.map(data => data.product_name),
          datasets: [
            {
              label: 'Units Sold',
              data: sales.map(data => data.units_sold),
              backgroundColor: '#dc2626',
              yAxisID: 'yUnitsSold',
            },
            {
              label: 'Total Sales',
              data: sales.map(data => data.total_sales),
              backgroundColor: '#2563eb',
              yAxisID: 'yTotalSales',
            },
          ],
        }}
      />
    </div>
  );
};

export default SalesGraphs;
