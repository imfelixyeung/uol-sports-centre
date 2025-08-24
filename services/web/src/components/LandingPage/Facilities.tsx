import Link from 'next/link';
import {useGetFacilitiesQuery} from '~/redux/services/api';
import {ProductCarousel} from '../ProductCarousel';
import Typography from '../Typography';
import {env} from '~/env.mjs';
import {FacilitiesResponse} from '~/redux/services/types/facilities';
import {mockFacilities} from '~/data/mock';

const Facilities = () => {
  const facilitiesData = useGetFacilitiesQuery(undefined, {
    skip: !!env.NEXT_PUBLIC_USE_MOCK_DATA,
  });
  const facilities = env.NEXT_PUBLIC_USE_MOCK_DATA
    ? mockFacilities
    : facilitiesData.data;

  if (facilitiesData.isLoading) return <>Loading...</>;
  if ((facilitiesData.isError && !env.NEXT_PUBLIC_USE_MOCK_DATA) || !facilities)
    return <>Something went wrong...</>;

  return (
    <div className="bg-white text-black">
      <div className="container flex flex-col gap-6 py-8">
        <Typography.h2 styledAs="h1" uppercase>
          <Link href="/facilities">{'/// Facilities'}</Link>
        </Typography.h2>
        <ProductCarousel
          products={facilities.map(facility => ({
            image: '/assets/images/patterns/card.svg', // TODO: get image from facilities api
            name: facility.name,
            description: facility.description,
            url: `/facilities/${facility.id}`,
          }))}
        />
      </div>
    </div>
  );
};

export default Facilities;
