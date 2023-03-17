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
  opening_time: null;
  closing_time: null;
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
