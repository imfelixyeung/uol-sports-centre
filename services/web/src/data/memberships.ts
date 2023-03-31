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
    price: 'From £25',
    buttonLabel: 'Book',
  },
  {
    id: 'Membership-Monthly',
    name: 'Monthly',
    price: '£35 / month',
    buttonLabel: 'Buy',
  },
  {
    id: 'Membership-Yearly',
    name: 'Yearly',
    price: '£300 / year',
    buttonLabel: 'Buy',
    bestValue: true,
  },
];
