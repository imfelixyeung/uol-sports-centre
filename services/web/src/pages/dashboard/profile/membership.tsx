import {useRouter} from 'next/router';
import toast from 'react-hot-toast';
import Button, {buttonStyles} from '~/components/Button';
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
  useCancelMembershipMutation,
  useCreateCheckoutSessionMutation,
  useGetCustomerPortalQuery,
  useGetPricesQuery,
} from '~/redux/services/api';

const MembershipPage = () => {
  const {user} = useUser();
  const {token, session} = useAuth();
  const [cancelMembership] = useCancelMembershipMutation();
  const customerPortalData = useGetCustomerPortalQuery({
    userId: session!.user.id,
    token: token!,
  });
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();
  const router = useRouter();

  const activityPricesData = useGetPricesQuery({
    productType: 'Activity',
    token: token!,
  });
  const facilityPricesData = useGetPricesQuery({
    productType: 'Facility',
    token: token!,
  });
  const membershipsData = useGetPricesQuery({
    productType: 'Membership',
    token: token!,
  });

  const activityPrices = activityPricesData.data;
  const facilityPrices = facilityPricesData.data;

  if (
    activityPricesData.isLoading ||
    facilityPricesData.isLoading ||
    membershipsData.isLoading
  )
    return <>Loading</>;
  if (!activityPrices || !facilityPrices) return <>Something went wrong</>;

  const lowestPrice = [...activityPrices, ...facilityPrices]
    .map(price => price.price)
    .sort((a, b) => (a > b ? 1 : a < b ? -1 : 0))[0];

  const currentMembership = (user?.membership ?? 'Individual') as
    | 'Membership-Yearly'
    | 'Membership-Monthly'
    | 'Individual';

  const onMembershipBuyCTA = async (
    membership: MembershipCardProps['membership']
  ) => {
    if (membership.id === 'Individual') {
      await router.push('/dashboard/bookings/new');
      return;
    }

    if (currentMembership === membership.id) {
      await toast.promise(
        cancelMembership({
          token: token!,
          userId: session!.user.id,
        }).unwrap(),
        {
          loading: 'Cancelling membership...',
          success: 'Membership cancelled',
          error: 'Something went wrong...',
        }
      );
      return;
    }

    const checkoutUrl = await toast.promise(
      createCheckoutSession({
        items: [
          {
            type: membership.id,
            data: {
              event: 0,
              starts: new Date().toISOString(),
            },
          },
        ],
        metadata: {
          successUrl: `${window.location.origin}/dashboard/profile`,
          cancelUrl: `${window.location.origin}/dashboard/profile`,
        },
        token: token!,
        user: session!.user.id,
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

  if (!lowestPrice) return <>Something went wrong</>;

  const _memberships: MembershipCardProps['membership'][] = memberships.map(
    membership => {
      const current = membership.id === currentMembership;
      const price =
        membership.id === 'Individual'
          ? lowestPrice
          : membershipsData.data?.find(
              data => data.productName === membership.id
            )?.price ?? 'Unknown';
      return {
        ...membership,
        price: membership.price.replace('{{price}}', price),
        current,
        buttonLabel: current
          ? membership.id === 'Individual'
            ? membership.buttonLabel
            : 'Cancel'
          : membership.buttonLabel,
        bestValue: false,
        buttonProps: {
          intent: current
            ? membership.id === 'Individual'
              ? 'secondary'
              : 'danger'
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
          <Button
            type="button"
            intent="secondary"
            outline
            onClick={() => void router.back()}
          >
            Back
          </Button>
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
