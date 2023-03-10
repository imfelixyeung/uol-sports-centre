import type {FC} from 'react';
import ScrollArea from '../ScrollArea';
import Typography from '../Typography';

const testimonials = [
  {
    name: 'Heather Poole',
    image: '/assets/images/pexels-andrea-piacquadio-733872.jpg',
    title: '3 Year Member',
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat aliquid explicabo quidem nihil soluta rem voluptas impedit deleniti labore. Consectetur amet vero aliquid cum officiis. Architecto maxime vitae explicabo unde?',
  },
  {
    name: 'Shawn Hicks',
    image: '/assets/images/pexels-bruno-salvadori-2269872.jpg',
    title: 'Personal Trainer',
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat aliquid explicabo quidem nihil soluta rem voluptas impedit deleniti labore. Consectetur amet vero aliquid cum officiis. Architecto maxime vitae explicabo unde?',
  },
  {
    name: 'Jenny Davis',
    image: '/assets/images/pexels-pixabay-415829.jpg',
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
    <div className="container flex flex-col gap-6 py-8">
      <Typography.h2 styledAs="h1" uppercase>
        {'/// Testimonials'}
      </Typography.h2>
      <ScrollArea>
        <div className="flex gap-6 pb-3">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard testimonial={testimonial} key={index} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

interface TestimonialCardProps {
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

export default Testimonials;
