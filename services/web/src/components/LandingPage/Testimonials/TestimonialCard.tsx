import type {FC} from 'react';
import Typography from '~/components/Typography';
import type {Testimonial} from './types';

export interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: FC<TestimonialCardProps> = ({testimonial}) => {
  const {name, image, title, content} = testimonial;
  return (
    <blockquote className="flex min-w-[22rem] snap-center flex-col gap-6 p-6 even:bg-white even:text-black">
      <Typography.p className="text-justify indent-6">{content}</Typography.p>
      <cite className="flex items-center gap-5">
        <div className="aspect-square w-20">
          <img
            src={image}
            alt={`${name} Profile Picture`}
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <Typography.span styledAs="h2" className="not-italic" uppercase>
            {name}
          </Typography.span>
          <Typography.span styledAs="subtext" className="not-italic" uppercase>
            {title}
          </Typography.span>
        </div>
      </cite>
    </blockquote>
  );
};

export default TestimonialCard;
