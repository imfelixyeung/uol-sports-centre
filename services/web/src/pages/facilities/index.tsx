import clsx from 'clsx';
import FancyChevronPageNav from '~/components/FancyChevronPageNav';
import PageHero from '~/components/PageHero';
import Typography from '~/components/Typography';
import {
  useGetFacilitiesQuery,
  useGetFacilityActivitiesQuery,
} from '~/redux/services/api';

const FacilitiesPage = () => {
  const facilitiesData = useGetFacilitiesQuery();
  const facilities = facilitiesData.data;
  const activitiesData = useGetFacilityActivitiesQuery();
  const activities = activitiesData.data;

  if (!facilities || !activities) return null; // TODO: handle loading and errors

  // TODO: refactor and modulate .map returns into components

  return (
    <div className="flex grow flex-col">
      <PageHero title="Facilities" />
      <FancyChevronPageNav
        image="/assets/images/pexels-alexey-komissarov-9022679.jpg"
        links={facilities.map(facility => ({
          label: facility.name,
          url: `/facilities/${facility.id}`,
        }))}
      />
      <div className="grow">
        {facilities.map((facility, index) => {
          const reverse = index % 2 === 0;
          const relatedActivities = activities.filter(
            activity => activity.facility_id === facility.id
          );

          return (
            <div
              key={facility.id}
              className={clsx(
                reverse ? 'bg-white text-black' : 'bg-black text-white'
              )}
            >
              <div className="container py-16">
                <div
                  className={clsx(
                    'flex flex-col-reverse items-center justify-between gap-8',
                    reverse ? 'md:flex-row-reverse' : 'md:flex-row'
                  )}
                >
                  <div>
                    <Typography.h1>{facility.name}</Typography.h1>
                    <Typography.p className="mt-6">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Dolore facere pariatur quo quod esse corrupti
                      exercitationem dolorum dignissimos delectus quibusdam
                      ipsum harum, quam cum vero id fugit veniam aut est!
                    </Typography.p>
                  </div>
                  <img className="aspect-video w-full bg-gray-500 md:h-48 md:w-auto" />
                </div>
                <div
                  className={clsx(
                    'mt-6 flex flex-wrap items-center gap-8',
                    reverse ? 'md:flex-row-reverse' : 'md:flex-row'
                  )}
                >
                  {relatedActivities.map(activity => (
                    <Typography
                      key={activity.id}
                      styledAs="navLink"
                      className="underline"
                    >
                      {activity.name}
                    </Typography>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FacilitiesPage;
