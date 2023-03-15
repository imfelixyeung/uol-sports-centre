export type Activity = {
  id: number;
  name: string;
  facility_id: number;
  capacity: number;
  duration: number;
};

// http://gateway/api/facilities/activities
export type ActivitiesResponse = Activity[];

export type ActivityResponse = Activity;
