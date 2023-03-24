import type {NextPage} from 'next';
import PageHero from '~/components/PageHero';
import Typography from '~/components/Typography';
import {withPageAuthRequired} from '~/providers/auth';
import {withUserOnboardingRequired} from '~/providers/user';

const ManagementPage: NextPage = () => {
  return (
    <div>
      <PageHero title="Managemer Dashboard" />
      <section className="container">
        <Typography.h2>Amend Prices</Typography.h2>
        <form action="">Form</form>
        <Typography.h2>Change discount amount</Typography.h2>
        <form action="">Form</form>
        <Typography.h2>Add new employee</Typography.h2>
        <form action="">Form</form>
        <Typography.h2>Add facility</Typography.h2>
        <form action="">Form</form>
        <Typography.h2>Amend facility</Typography.h2>
        <form action="">Form</form>
        <Typography.h2>Add activity</Typography.h2>
        <form action="">Form</form>
        <Typography.h2>Amend activity</Typography.h2>
        <form action="">Form</form>
        <Typography.h2>Data visualisation from today to today-7</Typography.h2>
        <Typography.h3>Total sales</Typography.h3>
        <Typography.h3>Total facility bookings</Typography.h3>
        <Typography.h3>Total activity bookings</Typography.h3>
      </section>
    </div>
  );
};

export default withPageAuthRequired(
  withUserOnboardingRequired(ManagementPage),
  {rolesAllowed: ['ADMIN', 'MANAGER']}
);
