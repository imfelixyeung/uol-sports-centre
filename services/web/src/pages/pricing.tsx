import Memberships from '~/components/LandingPage/Memberships';
import PageHero from '~/components/PageHero';
import Typography from '~/components/Typography';
import {mockActivityPrices, mockFacilityPrices} from '~/data/mock';
import {env} from '~/env.mjs';
import {useAuth} from '~/providers/auth/hooks/useAuth';
import {useGetPricesQuery} from '~/redux/services/api';

const PricingPage = () => {
  const {token} = useAuth();
  const activityPricesData = useGetPricesQuery({
    productType: 'Activity',
    token: token!,
  });
  const facilityPricesData = useGetPricesQuery({
    productType: 'Facility',
    token: token!,
  });

  const activityPrices = env.NEXT_PUBLIC_USE_MOCK_DATA
    ? mockActivityPrices
    : activityPricesData.data;
  const facilityPrices = env.NEXT_PUBLIC_USE_MOCK_DATA
    ? mockFacilityPrices
    : facilityPricesData.data;

  if (activityPricesData.isLoading || facilityPricesData.isLoading)
    return <>Loading</>;
  if (!activityPrices || !facilityPrices) return <>Something went wrong</>;

  return (
    <>
      <PageHero title="Pricing" />
      <div className="container my-8 grid grid-cols-2 gap-3">
        <div className="px-3 py-6 ring-2 ring-inset ring-white">
          {facilityPrices.map(facility => (
            <>
              <Typography.h3>{facility.productName} Price</Typography.h3>
              <Typography.h3
                styledAs="h1"
                desktopStyledAs="display2"
                className="text-center !font-normal"
              >
                £{Number(facility.price).toFixed(2)}
              </Typography.h3>
            </>
          ))}
        </div>
        <div className="px-3 py-6 ring-2 ring-inset ring-white">
          {activityPrices.map(activity => (
            <>
              <Typography.h3>{activity.productName} Price</Typography.h3>
              <Typography.h3
                styledAs="h1"
                desktopStyledAs="display2"
                className="text-center !font-normal"
              >
                £{Number(activity.price).toFixed(2)}
              </Typography.h3>
            </>
          ))}
        </div>
      </div>
      <div className="container my-8">
        <Memberships />
      </div>
    </>
  );
};

export default PricingPage;
