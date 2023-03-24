export interface FacilityActivity {
  id: number;
  facility_id: number;
  name: string;
  capacity: number;
  duration: number;
}

export interface FacilityTime {
  id: number;
  facility_id: number;
  day: string;
  opening_time: number;
  closing_time: number;
}

export interface Facility {
  id: number;
  name: string;
  capacity: number;
}

export type FacilitiesResponse = Facility[];
export type FacilityResponse = {
  facility: Facility;
  status: 'ok';
};

export type FacilityActivitiesResponse = FacilityActivity[];
export type FacilityActivityResponse = FacilityActivity;

export type FacilityTimesResponse = FacilityTime[];
export type FacilityTimeResponse = FacilityTime;

export type CreateFacilityRequest = Omit<Facility, 'id'>;
export type CreateFacilityResponse = Facility;

export type CreateFacilityActivityRequest = Omit<FacilityActivity, 'id'>;
export type CreateFacilityActivityResponse = FacilityActivity;

export type UpdateFacilityRequest = Facility;
export type UpdateFacilityResponse = {
  status: string;
  message: string;
  facility: Facility;
};

export type UpdateFacilityActivityRequest = FacilityActivity;
export type UpdateFacilityActivityResponse = {
  status: string;
  message: string;
  activity: FacilityActivity;
};
