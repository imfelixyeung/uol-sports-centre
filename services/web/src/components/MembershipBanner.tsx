import Link from 'next/link';
import {useUser} from '~/providers/user/hooks/useUser';
import {buttonStyles} from './Button';
import Typography from './Typography';

const MembershipBanner = () => {
  const {user} = useUser();
  if (!user) return null;

  const membership = user.membership ?? 'No membership...';

  return (
    <div className="w-full bg-white p-8 text-black">
      <div className="flex justify-between">
        <Typography.h3>{membership}</Typography.h3>
        <Typography.p>{'£xxx/yr'}</Typography.p>
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
