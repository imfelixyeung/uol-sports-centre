import PageHero from '~/components/PageHero';
import Typography from '~/components/Typography';
import {withPageAuthRequired} from '~/providers/auth';
import {withUserOnboardingRequired} from '~/providers/user';

const EmployeePage = () => {
  return (
    <div>
      <PageHero title="Employee Dashboard" />
      <section className="container">
        <Typography.h2>Create booking for customer</Typography.h2>
        <form action="">Form</form>
        <Typography.h3>View/Amend booking for customer</Typography.h3>
        <form action="">Form</form>
      </section>
    </div>
  );
};

export default withPageAuthRequired(withUserOnboardingRequired(EmployeePage), {
  rolesAllowed: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
});
