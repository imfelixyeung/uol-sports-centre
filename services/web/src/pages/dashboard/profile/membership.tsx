import Button from '~/components/Button';
import type {MembershipCardProps} from '~/components/MembershipCard';
import MembershipCard from '~/components/MembershipCard';
import PageHero from '~/components/PageHero';
import Typography from '~/components/Typography';
import {memberships} from '~/data/memberships';
import {useUser} from '~/providers/user/hooks/useUser';

const MembershipPage = () => {
  const {user} = useUser();

  const currentMembership = 'monthly';

  const _memberships: MembershipCardProps['membership'][] = memberships.map(
    membership => {
      const current = membership.id === currentMembership;
      return {
        ...membership,
        current,
        buttonLabel: current ? 'Cancel' : membership.buttonLabel,
        bestValue: false,
        buttonProps: {
          intent: current
            ? 'danger'
            : membership.bestValue
            ? 'primary'
            : 'secondary',
        },
      };
    }
  );

  return (
    <div className="flex grow flex-col">
      <PageHero
        title={user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
        subtitle={user?.membership ?? 'No membership...'}
      />
      <div className="grow bg-white py-8 text-black">
        <section className="container">
          <Typography.h2>Membership Management</Typography.h2>
          <div className="grid grid-cols-3 gap-3">
            {_memberships.map((membership, index) => (
              <MembershipCard key={index} membership={membership} />
            ))}
          </div>
        </section>
      </div>
      <div className="bg-white py-8 text-black">
        <div className="container flex flex-wrap items-center justify-between">
          <Button intent="secondary" outline>
            Back
          </Button>
          <Button intent="secondary" outline>
            Manage Payment Details{' '}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MembershipPage;
