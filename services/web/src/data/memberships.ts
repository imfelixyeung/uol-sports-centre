export interface Membership {
  id: 'individual' | 'membership-monthly' | 'membership-yearly';
  name: string;
  price: string;
  buttonLabel: string;
  bestValue?: boolean;
}

export const memberships: Membership[] = [
  {
    id: 'individual',
    name: 'Individual bookings',
    price: 'From £25',
    buttonLabel: 'Book',
  },
  {
    id: 'membership-monthly',
    name: 'Monthly',
    price: '£35 / month',
    buttonLabel: 'Buy',
  },
  {
    id: 'membership-yearly',
    name: 'Yearly',
    price: '£300 / year',
    buttonLabel: 'Buy',
    bestValue: true,
  },
];
