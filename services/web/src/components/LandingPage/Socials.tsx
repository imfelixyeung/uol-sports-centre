import Typography from '../Typography';

const socials = ['Instagram', 'Twitter', 'Facebook', 'LinkedIn', 'SocialApp'];

const Socials = () => {
  return (
    <div className="py-8 container flex flex-col gap-6">
      <Typography as="h2" styledAs="h3" uppercase>
        {'/// Socials'}
      </Typography>
      <div className="flex gap-8 items-center justify-between">
        <img
          className="object-cover max-w-sm aspect aspect-square"
          src="/assets/images/pexels-zakaria-boumliha-2827400.jpg"
          alt="Person reaching goal by handstanding"
        />
        <div className="flex flex-col gap-5">
          {socials.map((social, index) => (
            <Typography as="h3" styledAs="h4" uppercase key={index}>
              <span>{social}</span>{' '}
              <span className="text-primary">{'>>>'}</span>
            </Typography>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Socials;
