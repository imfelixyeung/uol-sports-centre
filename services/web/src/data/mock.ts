import {
  FacilitiesResponse,
  FacilityActivitiesResponse,
  FacilityTime,
  FacilityTimesResponse,
} from '~/redux/services/types/facilities';
import {GetPricesResponse} from '~/redux/services/types/payments';
import {StatusReportResponse} from '~/redux/services/types/status';

export const mockFacilities: FacilitiesResponse = [
  {
    id: 1,
    name: 'Facility 1',
    capacity: 10,
    description: 'Facility 1 Description',
  },
  {
    id: 2,
    name: 'Facility 2',
    capacity: 10,
    description: 'Facility 2 Description',
  },
  {
    id: 3,
    name: 'Facility 3',
    capacity: 10,
    description: 'Facility 3 Description',
  },
  {
    id: 4,
    name: 'Facility 4',
    capacity: 10,
    description: 'Facility 4 Description',
  },
  {
    id: 5,
    name: 'Facility 5',
    capacity: 10,
    description: 'Facility 5 Description',
  },
  {
    id: 6,
    name: 'Facility 6',
    capacity: 10,
    description: 'Facility 6 Description',
  },
];

export const mockFacilityActivities: FacilityActivitiesResponse = [
  {
    id: 1,
    facility_id: 1,
    name: 'Swimming',
    capacity: 1,
    duration: 60,
  },
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
export const mockFacilityTimes: FacilityTimesResponse = mockFacilities.flatMap(
  f =>
    days.map(day => ({
      id: 1,
      facility_id: f.id,
      day,
      opening_time: 9.5 * 60,
      closing_time: 17 * 60,
    })) satisfies FacilityTime[]
);

export const mockFacilityPrices: GetPricesResponse = [
  {
    price: '5.5',
    productName: 'Product Name',
  },
  {
    price: '5.5',
    productName: 'Product Name',
  },
];

export const mockActivityPrices: GetPricesResponse = [
  {
    price: '5.5',
    productName: 'Product Name',
  },
  {
    price: '5.5',
    productName: 'Product Name',
  },
];

export const mockMembershipPrices: GetPricesResponse = [
  {
    price: '5',
    productName: 'Individual',
  },
  {
    price: '10',
    productName: 'Membership-Monthly',
  },
  {
    price: '100',
    productName: 'Membership-Yearly',
  },
];

const services = [
  'auth',
  'booking',
  'facilities',
  'payments',
  'status',
  'users',
  'web',
];

export const mockStatuses: StatusReportResponse = {
  success: true,
  data: services.map(service => ({
    service,
    status: 'up',
    statusCode: 200,
    timestamp: Math.floor(Date.now() / 60000) * 60000,
  })),
};
