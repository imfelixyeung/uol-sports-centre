import clsx from 'clsx';
import type {FC} from 'react';
import Button from '../Button';
import Typography from '../Typography';

const memberships = [
  {
    name: '1 Session',
    price: 'From £25',
    buttonLabel: 'Buy',
  },
  {
    name: 'Monthly Pass',
    price: '£35 / month',
    buttonLabel: 'Buy',
  },
  {
    name: 'Yearly Pass',
    price: '£300 / month',
    buttonLabel: 'Buy',
    bestValue: true,
  },
];

type Membership = (typeof memberships)[0];

const Memberships = () => {
  return (
    <div className="container flex flex-col gap-6 py-8">
      <Typography.h2 styledAs="h1" uppercase>
        {'/// Memberships'}
      </Typography.h2>
      <div className="grid gap-3 md:grid-cols-3">
        {memberships.map((membership, index) => (
          <div key={index} className="grow">
            <MembershipCard membership={membership} />
          </div>
        ))}
      </div>
    </div>
  );
};

interface MembershipCardProps {
  membership: Membership;
}

const MembershipCard: FC<MembershipCardProps> = ({membership}) => {
  const {buttonLabel, name, price, bestValue} = membership;
  return (
    <div className="flex h-full flex-col">
      <div
        className={clsx(
          'relative flex h-64 grow items-end p-3 text-black',
          bestValue ? 'bg-card-alt' : 'bg-card',
          'bg-cover bg-center'
        )}
      >
        <Typography.p styledAs="h1" uppercase>
          {name}
        </Typography.p>
        {bestValue && (
          <div className="absolute top-6 right-0 bg-black py-2 px-4 text-primary">
            <Typography.p styledAs="button">Best Value</Typography.p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 bg-neutral-700 p-3 text-white">
        <Typography.span>{price}</Typography.span>
        <Button intent="primary">{buttonLabel}</Button>
      </div>
    </div>
  );
};

export default Memberships;
