import clsx from 'clsx';
import Link from 'next/link';
import type {FC, ReactNode} from 'react';
import {buttonStyles} from '~/components/Button';
import PageHero from '~/components/PageHero';
import Typography from '~/components/Typography';
import {withPageAuthRequired} from '~/providers/auth';
import {withUserOnboardingRequired} from '~/providers/user';
import {useUser} from '~/providers/user/hooks/useUser';

const MembershipPage = () => {
  const {user} = useUser();

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
            <MembershipCard
              name="Individual"
              description="Perfect for getting started"
              features={['1 Booking']}
              price={
                <>
                  <span>£15</span>
                  <span aria-label="per" className="sr-only">
                    {'/'}
                  </span>
                  <Typography.span styledAs="data">Booking</Typography.span>
                </>
              }
              callToAction={
                <Link
                  className={buttonStyles({intent: 'primary'})}
                  href="/dashboard/bookings/new"
                >
                  Book individual sessions
                </Link>
              }
            />
            <MembershipCard
              current
              name="Monthly"
              description="Beginner value"
              features={['Unlimited bookings']}
              price={
                <>
                  <span>£35</span>
                  <span aria-label="per" className="sr-only">
                    {'/'}
                  </span>
                  <Typography.span styledAs="data">Month</Typography.span>
                </>
              }
              callToAction={
                <button className={buttonStyles({intent: 'primary'})}>
                  Cancel Monthly Membership
                </button>
              }
            />
            <MembershipCard
              name="Yearly"
              description="Best value"
              features={['Unlimited booking', 'Year']}
              price={
                <>
                  <span>£15</span>
                  <span aria-label="per" className="sr-only">
                    {'/'}
                  </span>
                  <Typography.span styledAs="data">Booking</Typography.span>
                </>
              }
              callToAction={
                <button className={buttonStyles({intent: 'primary'})}>
                  Purchase Yearly Membership
                </button>
              }
            />
          </div>
        </section>
      </div>
    </div>
  );
};

const MembershipCard: FC<{
  current?: boolean;
  name: string;
  description: string;
  price: ReactNode;
  features?: string[];
  callToAction: ReactNode;
}> = ({current, callToAction, description, features = [], name, price}) => {
  return (
    <div
      className={clsx(
        'relative flex flex-col bg-black/10 p-6 text-black',
        current && 'ring-4 ring-inset ring-black/80'
      )}
    >
      {current && (
        <div className="absolute top-0 right-0 bg-black/20 p-3 ring-4 ring-inset ring-black/80">
          <Typography.p styledAs="smallP">
            <span className="font-bold">Current</span>
          </Typography.p>
        </div>
      )}
      <div className="grow">
        <Typography.h3>{name}</Typography.h3>
        <Typography.p styledAs="data">{description}</Typography.p>
        <Typography.p className="flex items-end gap-3">{price}</Typography.p>
        {features.length > 0 && (
          <ul className="list-inside list-disc">
            {features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        )}
      </div>
      <div>{callToAction}</div>
    </div>
  );
};

export default withPageAuthRequired(withUserOnboardingRequired(MembershipPage));
