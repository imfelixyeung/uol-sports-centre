import {useRouter} from 'next/router';
import {memberships} from '~/data/memberships';
import {useAuth} from '~/providers/auth/hooks/useAuth';
import {useGetPricesQuery} from '~/redux/services/api';
import MembershipCard from '../MembershipCard';
import Typography from '../Typography';

const Memberships = () => {
  const router = useRouter();
  const {token} = useAuth();
  const activityPricesData = useGetPricesQuery({
    productType: 'Activity',
    token: token!,
  });
  const facilityPricesData = useGetPricesQuery({
    productType: 'Facility',
    token: token!,
  });
  const membershipsData = useGetPricesQuery({
    productType: 'Membership',
    token: token!,
  });

  const activityPrices = activityPricesData.data;
  const facilityPrices = facilityPricesData.data;

  if (
    activityPricesData.isLoading ||
    facilityPricesData.isLoading ||
    membershipsData.isLoading
  )
    return <>Loading</>;
  if (!activityPrices || !facilityPrices) return <>Something went wrong</>;

  const lowestPrice = [...activityPrices, ...facilityPrices]
    .map(price => price.price)
    .sort((a, b) => (a > b ? 1 : a < b ? -1 : 0))[0];

  if (!lowestPrice) return <>Something went wrong</>;

  return (
    <div className="container flex flex-col gap-6 py-8">
      <Typography.h2 styledAs="h1" uppercase>
        {'/// Memberships'}
      </Typography.h2>
      <div className="grid gap-3 md:grid-cols-3">
        {memberships.map((membership, index) => {
          // find corresponding price
          const price =
            membership.id === 'Individual'
              ? lowestPrice
              : membershipsData.data?.find(
                  data => data.productName === membership.id
                )?.price ?? 'Unknown';

          // inject price
          const membershipWithPrice = {
            ...membership,
            price: membership.price.replace('{{price}}', price),
          };

          return (
            <div key={index} className="grow">
              <MembershipCard
                membership={membershipWithPrice}
                onCallToAction={() => {
                  void router.push('/dashboard/profile/membership');
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Memberships;
