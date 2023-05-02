import clsx from 'clsx';
import type {FC} from 'react';
import type {Membership} from '~/data/memberships';
import type {ButtonProps} from './Button';
import Button from './Button';
import Typography from './Typography';

export interface MembershipCardProps {
  membership: Membership & {
    current?: boolean;
  } & {
    buttonProps?: ButtonProps;
  };
  onCallToAction?: () => void;
}

const MembershipCard: FC<MembershipCardProps> = ({
  membership,
  onCallToAction,
}) => {
  const {buttonLabel, name, price, bestValue, current, buttonProps} =
    membership;
  return (
    <div className="flex h-full flex-col">
      <div
        className={clsx(
          'relative flex h-64 grow items-end p-3 text-black',
          bestValue || current ? 'bg-card-alt' : 'bg-card',
          'bg-cover bg-center'
        )}
      >
        <Typography.p styledAs="h1" uppercase>
          {name}
        </Typography.p>
        {current ? (
          <div className="absolute top-6 right-0 bg-white py-2 px-4 text-black">
            <Typography.p styledAs="button">Current</Typography.p>
          </div>
        ) : (
          bestValue && (
            <div className="absolute top-6 right-0 bg-white py-2 px-4 text-black">
              <Typography.p styledAs="button">Best Value</Typography.p>
            </div>
          )
        )}
      </div>
      <div className="flex items-center justify-between gap-3 bg-[#2C2C2C] p-3 text-white">
        <Typography.span>{price}</Typography.span>
        <Button intent="primary" {...buttonProps} onClick={onCallToAction}>
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
};

export default MembershipCard;
