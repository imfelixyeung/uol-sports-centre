import type {FC} from 'react';
import {useGetFacilityActivityQuery} from '~/redux/services/api';
import type {
  Facility,
  FacilityActivity,
} from '~/redux/services/types/facilities';
import FacilityData from './FacilityData';

const FacilityActivityData: FC<{
  activityId: number;
  pick?: keyof FacilityActivity;
  expandFacility?: keyof Facility;
}> = ({activityId, pick, expandFacility}) => {
  const fallback = `Activity ${activityId}`;
  const activityData = useGetFacilityActivityQuery(activityId);

  if (activityData.isLoading || activityData.isError || !activityData.data)
    return <>{fallback}</>;

  const activity = activityData.data;

  if (!activity) return <>{fallback}</>;

  if (expandFacility) {
    return (
      <FacilityData facilityId={activity.facility_id} pick={expandFacility} />
    );
  }

  if (!pick) return <>{fallback}</>;

  return <>{activity[pick]}</>;
};

export default FacilityActivityData;
