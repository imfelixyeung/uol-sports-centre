import PageHero from '~/components/PageHero';
import Typography from '~/components/Typography';
import {withPageAuthRequired} from '~/providers/auth';
import {withUserOnboardingRequired} from '~/providers/user';
import {useUser} from '~/providers/user/hooks/useUser';

const ProfilePage = () => {
  const {user} = useUser();

  return (
    <div className="flex grow flex-col">
      <PageHero title="Your Profile" />
      <section className="container my-8 flex grow gap-8">
        <div>
          <Typography.h2>First Name</Typography.h2>
          <Typography.p>{user?.firstName}</Typography.p>
        </div>
        <div>
          <Typography.h2>Last Name</Typography.h2>
          <Typography.p>{user?.lastName}</Typography.p>
        </div>
      </section>
    </div>
  );
};

export default withPageAuthRequired(withUserOnboardingRequired(ProfilePage));
