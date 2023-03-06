import Typography from '../Typography';

const ReachGoals = () => {
  return (
    <div className="py-8 container flex flex-col gap-6">
      <Typography as="h2" styledAs="h3" uppercase>
        {'/// Reach Your Goals'}
      </Typography>
      <div className="flex gap-8 items-center flex-col md:flex-row">
        <img
          className="object-cover md:max-w-sm"
          src="/assets/images/pexels-chevanon-photography-317155.jpg"
          alt="Person reaching goal by handstanding"
        />
        <Typography className="text-justify">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat
          aliquid explicabo quidem nihil soluta rem voluptas impedit deleniti
          labore. Consectetur amet vero aliquid cum officiis. Architecto maxime
          vitae explicabo unde?
        </Typography>
      </div>
    </div>
  );
};

export default ReachGoals;
