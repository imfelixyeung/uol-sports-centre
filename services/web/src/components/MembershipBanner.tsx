import Link from 'next/link';
import {useAuth} from '~/providers/auth/hooks/useAuth';
import {useUser} from '~/providers/user/hooks/useUser';
import {useGetPricesQuery} from '~/redux/services/api';
import {buttonStyles} from './Button';
import Typography from './Typography';

const MembershipBanner = () => {
  const {user} = useUser();
  const {token} = useAuth();

  const membershipsData = useGetPricesQuery({
    productType: 'Membership',
    token: token!,
  });

  if (!user || !membershipsData.data) return null;

  const {membership: _membership} = user;
  const membership = _membership || null; // empty string is not a membership
  const membershipData = membershipsData.data.find(
    data => data.productName === membership
  );

  return (
    <div className="w-full bg-white p-8 text-black">
      <div className="flex justify-between">
        <Typography.h3>{membership ?? 'No membership...'}</Typography.h3>
        {membership && (
          <Typography.p>
            {membershipData
              ? `£${Number(membershipData?.price).toFixed(2)}`
              : 'something went wrong... please contact support'}
          </Typography.p>
        )}
      </div>
      <div className="mt-3 flex justify-end">
        <Link
          className={buttonStyles({intent: 'primary', outline: true})}
          href="/dashboard/profile/membership"
        >
          Manage
        </Link>
      </div>
    </div>
  );
};

export default MembershipBanner;
