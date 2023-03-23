import {useUser} from '~/providers/user/hooks/useUser';
import Button from './Button';
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
        <Button intent="primary">Manage Membership</Button>
      </div>
    </div>
  );
};

export default MembershipBanner;
