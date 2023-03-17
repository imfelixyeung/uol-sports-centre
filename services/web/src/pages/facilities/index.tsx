import clsx from 'clsx';
import PageHero from '~/components/PageHero';
import Typography from '~/components/Typography';
import {useGetFacilitiesQuery} from '~/redux/services/api';

const FacilitiesPage = () => {
  const facilitiesData = useGetFacilitiesQuery();
  const facilities = facilitiesData.data;

  return (
    <div className="flex grow flex-col">
      <PageHero title="Facilities" />
      <div className="grow">
        {facilities?.map((facility, index) => (
          <div
            key={facility.id}
            className={clsx(
              index % 2 ? 'text-whitee bg-black' : 'bg-white text-black'
            )}
          >
            <div
              className={clsx(
                'container flex flex-col-reverse items-center justify-between gap-8 py-8',
                index % 2 ? 'md:flex-row-reverse' : 'md:flex-row'
              )}
            >
              <div>
                <Typography.h1>{facility.name}</Typography.h1>
                <Typography.p className="mt-6">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Dolore facere pariatur quo quod esse corrupti exercitationem
                  dolorum dignissimos delectus quibusdam ipsum harum, quam cum
                  vero id fugit veniam aut est!
                </Typography.p>
              </div>
              <div className="aspect-video w-full bg-gray-500 md:h-48 md:w-auto"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacilitiesPage;
