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
    <div className="py-8 container flex flex-col gap-6">
      <Typography as="h2" styledAs="h3" uppercase>
        {'/// Memberships'}
      </Typography>
      <div className="grid grid-cols-3 gap-3">
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
    <div className="flex flex-col h-full">
      <div
        className={clsx(
          'text-base-100 p-3 h-64 flex items-end relative grow',
          bestValue ? 'bg-primary' : 'bg-base-content'
        )}
      >
        <Typography as="p" styledAs="h3" uppercase>
          {name}
        </Typography>
        {bestValue && (
          <div className="absolute top-6 right-0 py-2 px-4 bg-base-content">
            <Typography as="p" styledAs="h6">
              Best Value
            </Typography>
          </div>
        )}
      </div>
      <div className="bg-neutral-700 p-3 flex items-center justify-between gap-3 text-base-content">
        <Typography as="span">{price}</Typography>
        <Button intent="primary">{buttonLabel}</Button>
      </div>
    </div>
  );
};

export default Memberships;
