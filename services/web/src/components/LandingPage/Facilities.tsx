import {useGetFacilitiesQuery} from '~/redux/services/api';
import {ProductCarousel} from '../ProductCarousel';
import Typography from '../Typography';

const Facilities = () => {
  const facilitiesData = useGetFacilitiesQuery();
  const facilities = facilitiesData.data;

  if (!facilities) return null; // TODO: handle loading and error

  return (
    <div className="bg-white text-black">
      <div className="container flex flex-col gap-6 py-8">
        <Typography.h2 styledAs="h1" uppercase>
          {'/// Facilities'}
        </Typography.h2>
        <ProductCarousel
          products={facilities.map(facility => ({
            image: '/assets/images/patterns/card.svg', // TODO: get image from facilities api
            name: facility.name,
            description:
              'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, ea facere. Sapiente enim, nisi maiores repellendus ipsum explicabo itaque ducimus provident accusamus odio amet dolorum tenetur facilis obcaecati ea velit?',
            url: '#',
          }))}
        />
      </div>
    </div>
  );
};

export default Facilities;
