import Link from 'next/link';
import {useRouter} from 'next/router';
import toast from 'react-hot-toast';
import {buttonStyles} from '~/components/Button';
import type {MembershipCardProps} from '~/components/MembershipCard';
import MembershipCard from '~/components/MembershipCard';
import PageHero from '~/components/PageHero';
import Typography from '~/components/Typography';
import {memberships} from '~/data/memberships';
import {withPageAuthRequired} from '~/providers/auth';
import {useAuth} from '~/providers/auth/hooks/useAuth';
import {withUserOnboardingRequired} from '~/providers/user';
import {useUser} from '~/providers/user/hooks/useUser';
import {
  useCreateCheckoutSessionMutation,
  useGetCustomerPortalQuery,
} from '~/redux/services/api';

const MembershipPage = () => {
  const {user} = useUser();
  const {token, session} = useAuth();
  const customerPortalData = useGetCustomerPortalQuery({
    userId: session!.user.id,
    token: token!,
  });
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();
  const router = useRouter();

  const currentMembership = 'Individual';

  const onMembershipBuyCTA = async (
    membership: MembershipCardProps['membership']
  ) => {
    if (membership.id === 'Individual') {
      await router.push('/dashboard/bookings/new');
      return;
    }

    const checkoutUrl = await toast.promise(
      createCheckoutSession({
        items: [
          {
            type: membership.id,
            data: {
              eventId: 0,
              starts: new Date().toISOString(),
            },
          },
        ],
        metadata: {
          successUrl: `${window.location.origin}/dashboard/bookings`,
          cancelUrl: `${window.location.origin}/dashboard/bookings`,
        },
        token: token!,
        userId: session!.user.id,
      }).unwrap(),
      {
        loading: 'Creating checkout session...',
        success: 'Checkout session created',
        error: 'Something went wrong...',
      }
    );

    const url = checkoutUrl.Checkout;
    await router.push(url);
  };

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
          <Typography.h2 className="mb-8">Membership Management</Typography.h2>
          <div className="grid gap-3 lg:grid-cols-3">
            {_memberships.map((membership, index) => (
              <MembershipCard
                key={index}
                membership={membership}
                onCallToAction={() => void onMembershipBuyCTA(membership)}
              />
            ))}
          </div>
        </section>
      </div>
      <div className="bg-white py-8 text-black">
        <div className="container flex flex-wrap items-center justify-between">
          <Link
            href="/dashboard/profile"
            className={buttonStyles({
              intent: 'secondary',
              outline: true,
            })}
          >
            Back
          </Link>
          <a
            href={customerPortalData.data?.Portal}
            className={buttonStyles({
              intent: 'primary',
              outline: true,
            })}
          >
            Manage Payment Details
          </a>
        </div>
      </div>
    </div>
  );
};

export default withPageAuthRequired(withUserOnboardingRequired(MembershipPage));
