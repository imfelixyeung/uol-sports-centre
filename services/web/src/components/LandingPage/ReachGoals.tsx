import Typography from '../Typography';

const ReachGoals = () => {
  return (
    <div className="container flex flex-col gap-6 py-8">
      <Typography.h2 styledAs="h1" uppercase>
        {'/// Reach Your Goals'}
      </Typography.h2>
      <div className="flex flex-col items-center gap-8 md:flex-row">
        <img
          className="object-cover md:max-w-sm"
          src="/assets/images/pexels-chevanon-photography-317155.jpg"
          alt="Person reaching goal by handstanding"
        />
        <Typography.p className="text-justify">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat
          aliquid explicabo quidem nihil soluta rem voluptas impedit deleniti
          labore. Consectetur amet vero aliquid cum officiis. Architecto maxime
          vitae explicabo unde?
        </Typography.p>
      </div>
    </div>
  );
};

export default ReachGoals;
