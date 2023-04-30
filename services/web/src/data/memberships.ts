export interface Membership {
  id: 'Individual' | 'Membership-Monthly' | 'Membership-Yearly';
  name: string;
  price: string;
  buttonLabel: string;
  bestValue?: boolean;
}

export const memberships: Membership[] = [
  {
    id: 'Individual',
    name: 'Individual bookings',
    price: 'From £{{price}}',
    buttonLabel: 'Book',
  },
  {
    id: 'Membership-Monthly',
    name: 'Monthly',
    price: '£{{price}} / month',
    buttonLabel: 'Buy',
  },
  {
    id: 'Membership-Yearly',
    name: 'Yearly',
    price: '£{{price}} / year',
    buttonLabel: 'Buy',
    bestValue: true,
  },
];
