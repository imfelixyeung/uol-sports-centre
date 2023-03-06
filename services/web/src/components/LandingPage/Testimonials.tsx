import type {FC} from 'react';
import Typography from '../Typography';

const testimonials = [
  {
    name: 'Heather Poole',
    image: 'https://source.unsplash.com/random/?Person,Selfie,0',
    title: '3 Year Member',
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat aliquid explicabo quidem nihil soluta rem voluptas impedit deleniti labore. Consectetur amet vero aliquid cum officiis. Architecto maxime vitae explicabo unde?',
  },
  {
    name: 'Shawn Hicks',
    image: 'https://source.unsplash.com/random/?Person,Selfie,1',
    title: 'Personal Trainer',
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat aliquid explicabo quidem nihil soluta rem voluptas impedit deleniti labore. Consectetur amet vero aliquid cum officiis. Architecto maxime vitae explicabo unde?',
  },
  {
    name: 'Jenny Davis',
    image: 'https://source.unsplash.com/random/?Person,Selfie,2',
    title: 'Owner',
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat aliquid explicabo quidem nihil soluta rem voluptas impedit deleniti labore. Consectetur amet vero aliquid cum officiis. Architecto maxime vitae explicabo unde?',
  },
  {
    name: 'Heather Poole',
    image: 'https://source.unsplash.com/random/?Person,Selfie,3',
    title: '3 Year Member',
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat aliquid explicabo quidem nihil soluta rem voluptas impedit deleniti labore. Consectetur amet vero aliquid cum officiis. Architecto maxime vitae explicabo unde?',
  },
  {
    name: 'Shawn Hicks',
    image: 'https://source.unsplash.com/random/?Person,Selfie,4',
    title: 'Personal Trainer',
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat aliquid explicabo quidem nihil soluta rem voluptas impedit deleniti labore. Consectetur amet vero aliquid cum officiis. Architecto maxime vitae explicabo unde?',
  },
  {
    name: 'Jenny Davis',
    image: 'https://source.unsplash.com/random/?Person,Selfie,5',
    title: 'Owner',
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat aliquid explicabo quidem nihil soluta rem voluptas impedit deleniti labore. Consectetur amet vero aliquid cum officiis. Architecto maxime vitae explicabo unde?',
  },
];

type Testimonial = (typeof testimonials)[0];

const Testimonials = () => {
  return (
    <div className="py-8 container flex flex-col gap-6">
      <Typography as="h2" styledAs="h3" uppercase>
        {'/// Testimonials'}
      </Typography>
      <div className="flex max-w-full overflow-y-auto gap-6 pb-3">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="grow">
            <TestimonialCard testimonial={testimonial} />
          </div>
        ))}
      </div>
    </div>
  );
};

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: FC<TestimonialCardProps> = ({testimonial}) => {
  const {name, image, title, content} = testimonial;
  return (
    <blockquote className="min-w-[22rem] bg-base-content text-base-100 p-6 flex flex-col gap-6">
      <p className="text-justify indent-6">{content}</p>
      <cite className="flex items-center gap-5">
        <div className="w-20 aspect-square">
          <img
            src={image}
            alt={`${name} Profile Picture`}
            className="object-cover w-full h-full rounded-full"
          />
        </div>
        <div className="flex flex-col">
          <Typography as="span" styledAs="h5" className="not-italic" uppercase>
            {name}
          </Typography>
          <Typography as="span" className="not-italic text-sm" uppercase>
            {title}
          </Typography>
        </div>
      </cite>
    </blockquote>
  );
};

export default Testimonials;
