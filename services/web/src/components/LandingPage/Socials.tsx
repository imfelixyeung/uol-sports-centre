import {ChevronDoubleRightIcon} from '@heroicons/react/24/solid';
import Typography from '../Typography';

const socials = ['Instagram', 'Twitter', 'Facebook', 'LinkedIn', 'SocialApp'];

const Socials = () => {
  return (
    <div className="py-8 container flex flex-col gap-6">
      <Typography as="h2" styledAs="h3" uppercase>
        {'/// Socials'}
      </Typography>
      <div className="flex gap-8 md:items-center justify-between flex-col md:flex-row">
        <img
          className="object-cover md:max-w-sm aspect aspect-square"
          src="/assets/images/pexels-zakaria-boumliha-2827400.jpg"
          alt="Person reaching goal by handstanding"
        />
        <div className="flex flex-col gap-5">
          {socials.map((social, index) => (
            <a
              key={index}
              className="flex items-center justify-between gap-3"
              href=""
            >
              <Typography as="h3" styledAs="h4" uppercase>
                <span>{social}</span>
              </Typography>
              <ChevronDoubleRightIcon
                className="h-8 stroke-[6] text-primary"
                aria-hidden
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Socials;
