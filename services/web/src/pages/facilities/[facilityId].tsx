import {useRouter} from 'next/router';
import Json from '~/components/Json';
import OpeningHours from '~/components/OpeningHours';
import PageHero from '~/components/PageHero';
import Typography from '~/components/Typography';
import {
  useGetFacilityActivitiesQuery,
  useGetFacilityQuery,
  useGetFacilityTimesQuery,
} from '~/redux/services/api';

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
      <PageHero title={facility?.name} />
      <div className="bg-white text-black">
        <div className="container my-8 grow">
          <Typography.h2>Data</Typography.h2>
          <Json data={facility} />

          <Typography.h2>Opening Hours</Typography.h2>
          {facilityTimes ? (
            <OpeningHours openingHours={facilityTimes} />
          ) : (
            'Loading...'
          )}

          <Typography.h2>Activities</Typography.h2>
          <Json data={facilityActivities} />
        </div>
      </div>
    </div>
  );
};

export default FacilitiesPage;
