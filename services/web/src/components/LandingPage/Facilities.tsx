import Link from 'next/link';
import {useGetFacilitiesQuery} from '~/redux/services/api';
import {ProductCarousel} from '../ProductCarousel';
import Typography from '../Typography';

const Facilities = () => {
  const facilitiesData = useGetFacilitiesQuery();
  const facilities = facilitiesData.data;

  if (facilitiesData.isLoading) return <>Loading...</>;
  if (facilitiesData.isError || !facilities)
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
