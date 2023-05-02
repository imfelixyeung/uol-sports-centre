import type {FC} from 'react';
import {useGetFacilityQuery} from '~/redux/services/api';
import type {Facility} from '~/redux/services/types/facilities';

const FacilityData: FC<{
  facilityId: number;
  pick?: keyof Facility;
}> = ({facilityId, pick}) => {
  const fallback = `Facility ${facilityId}`;
  const facilityData = useGetFacilityQuery(facilityId);

  if (facilityData.isLoading || facilityData.isError || !facilityData.data)
    return <>{fallback}</>;

  const facility = facilityData.data.facility;

  if (!facility) return <>{fallback}</>;

  if (!pick) return <>{fallback}</>;

  return <>{facility[pick]}</>;
};

export default FacilityData;
