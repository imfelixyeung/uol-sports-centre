import {memberships} from '~/data/memberships';
import MembershipCard from '../MembershipCard';
import Typography from '../Typography';

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

export default Memberships;
