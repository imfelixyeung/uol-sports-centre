export interface Membership {
  id: string;
  name: string;
  price: string;
  buttonLabel: string;
  bestValue?: boolean;
}

export const memberships = [
  {
    id: 'individual',
    name: 'Individual bookings',
    price: 'From £25',
    buttonLabel: 'Book',
  },
  {
    id: 'monthly',
    name: 'Monthly',
    price: '£35 / month',
    buttonLabel: 'Buy',
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: '£300 / year',
    buttonLabel: 'Buy',
    bestValue: true,
  },
];
