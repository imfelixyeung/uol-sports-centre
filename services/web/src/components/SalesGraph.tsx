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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesGraphs: FC = () => {
  const dummyData = [
    {
      product_name: 'product-1',
      product_type: 'product-type-1',
      units_sold: 50,
      total_sales: 35,
    },
    {
      product_name: 'product-2',
      product_type: 'product-type-2',
      units_sold: 25,
      total_sales: 66,
    },
    {
      product_name: 'product-3',
      product_type: 'product-type-1',
      units_sold: 100,
      total_sales: 13,
    },
  ];

  return (
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
        labels: dummyData.map(data => data.product_name),
        datasets: [
          {
            label: 'Units Sold',
            data: dummyData.map(data => data.units_sold),
            backgroundColor: '#dc2626',
            yAxisID: 'yUnitsSold',
          },
          {
            label: 'Total Sales',
            data: dummyData.map(data => data.total_sales),
            backgroundColor: '#2563eb',
            yAxisID: 'yTotalSales',
          },
        ],
      }}
    />
  );
};

export default SalesGraphs;
