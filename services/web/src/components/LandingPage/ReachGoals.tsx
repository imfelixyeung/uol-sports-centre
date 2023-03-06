import Typography from '../Typography';

const ReachGoals = () => {
  return (
    <div className="p-8">
      <Typography as="h2">{'/// Reach Your Goals'}</Typography>
      <div className="flex gap-8 items-center">
        <img
          className="aspect-video object-cover max-w-md"
          src="/assets/images/pexels-chevanon-photography-317155.jpg"
          alt="Person reaching goal by handstanding"
        />
        <Typography>
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
