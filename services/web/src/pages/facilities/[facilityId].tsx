import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import {useRouter} from 'next/router';
import OpeningHours from '~/components/OpeningHours';
import PageHero from '~/components/PageHero';
import Typography from '~/components/Typography';
import {
  useGetFacilityActivitiesQuery,
  useGetFacilityQuery,
  useGetFacilityTimesQuery,
} from '~/redux/services/api';
dayjs.extend(durationPlugin);

const FacilitiesPage = () => {
  const router = useRouter();
  const facilityId = Number(router.query.facilityId as string);
  const facilityData = useGetFacilityQuery(facilityId);
  const facility = facilityData.data?.facility;

  const facilityTimesData = useGetFacilityTimesQuery();
  const facilityTimes = facilityTimesData.data?.filter(
    time => time.facility_id === facilityId
  );

  const facilityActivitiesData = useGetFacilityActivitiesQuery();
  const facilityActivities = facilityActivitiesData.data?.filter(
    activity => activity.facility_id === facilityId
  );

  return (
    <div className="flex grow flex-col">
      <PageHero
        title={facility?.name}
        subtitle={facility?.capacity && `Capacity: ${facility.capacity}`}
      />
      <div className="bg-white text-black">
        <div className="container my-8 grow">
          <Typography.h3>{facility?.description}</Typography.h3>
          <Typography.h2>Opening Hours</Typography.h2>
          {facilityTimes ? (
            <OpeningHours openingHours={facilityTimes} />
          ) : (
            'Loading...'
          )}

          <Typography.h2 className="mt-8">Activities</Typography.h2>
          {facilityActivities ? (
            <ul className="ml-6 list-disc space-y-3">
              {facilityActivities.map(activity => {
                const {capacity, duration, id, name} = activity;
                const formattedDuration = dayjs
                  .duration({minutes: duration})
                  .humanize();
                return (
                  <li key={id}>
                    <b className="block">{name}</b>
                    <span className="block">Capacity: {capacity}</span>
                    <span className="block">Duration: {formattedDuration}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            'Loading...'
          )}
        </div>
      </div>
    </div>
  );
};

export default FacilitiesPage;
