import Typography from '~/components/Typography';
import {withPageAuthRequired} from '~/providers/auth';

const SupersecretPage = () => {
  return (
    <div className="grow bg-white text-black">
      <div className="container my-8">
        <Typography.h1>Secrets...</Typography.h1>
        <Typography.p styledAs="h2">
          If you are seeing this visually, that means you are logged in
        </Typography.p>
      </div>
    </div>
  );
};

export default withPageAuthRequired(SupersecretPage);
