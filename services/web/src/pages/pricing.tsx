import PageHero from '~/components/PageHero';
import Typography from '~/components/Typography';
import {useAuth} from '~/providers/auth/hooks/useAuth';
import {useGetPricesQuery} from '~/redux/services/api';

const PricingPage = () => {
  const {token} = useAuth();
  const activityPricesData = useGetPricesQuery({
    productType: 'activity',
    token: token!,
  });
  const facilityPricesData = useGetPricesQuery({
    productType: 'facility',
    token: token!,
  });

  const activityPrices = activityPricesData.data;
  const facilityPrices = facilityPricesData.data;

  if (activityPricesData.isLoading || facilityPricesData.isLoading)
    return <>Loading</>;
  if (!activityPrices || !facilityPrices) return <>Something went wrong</>;

  return (
    <>
      <PageHero title="Pricing" />
      <div className="container my-8">
        <Typography.h2>Facilities Prices</Typography.h2>
        <div className="grid w-full place-items-center py-2 ring-2 ring-inset ring-white">
          {facilityPrices.map(facility => (
            <>
              <Typography.h3>{facility.productName}</Typography.h3>
              <Typography.h3>
                £{(Number(facility.price) / 100).toFixed(2)}
              </Typography.h3>
            </>
          ))}
        </div>
        <Typography.h2>Activities Prices</Typography.h2>
        <div className="grid w-full place-items-center py-2 ring-2 ring-inset ring-white">
          {activityPrices.map(activity => (
            <>
              <Typography.h3>{activity.productName}</Typography.h3>
              <Typography.h3>
                £{(Number(activity.price) / 100).toFixed(2)}
              </Typography.h3>
            </>
          ))}
        </div>
      </div>
    </>
  );
};

export default PricingPage;
