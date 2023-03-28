import Link from 'next/link';
import {useUser} from '~/providers/user/hooks/useUser';
import {buttonStyles} from './Button';
import Typography from './Typography';

const MembershipBanner = () => {
  const {user} = useUser();
  if (!user) return null;

  const membership = user.membership ?? 'No membership...';

  return (
    <div className="w-full bg-white/20 p-8">
      <div className="flex justify-between">
        <Typography.h3>{membership}</Typography.h3>
        <Typography.h3>{'£xxx/yr'}</Typography.h3>
      </div>
      <Typography.p>Allows for x free bookings per week</Typography.p>
      <div className="flex justify-end">
        <Link
          className={buttonStyles({intent: 'primary'})}
          href="/dashboard/profile/membership"
        >
          Manage Membership
        </Link>
      </div>
    </div>
  );
};

export default MembershipBanner;
