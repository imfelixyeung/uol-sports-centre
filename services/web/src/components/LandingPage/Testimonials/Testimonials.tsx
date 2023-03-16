import type {FC} from 'react';
import ScrollArea from '../../ScrollArea';
import Typography from '../../Typography';
import TestimonialCard from './TestimonialCard';
import type {Testimonial} from './types';

export const dummyTestimonials: Testimonial[] = [
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

const Testimonials: FC = () => {
  return (
    <div className="container flex flex-col gap-6 py-8">
      <Typography.h2 styledAs="h1" uppercase>
        {'/// Testimonials'}
      </Typography.h2>
      <ScrollArea showControls alwaysShowScrollbar={false}>
        <div className="flex gap-6 pb-3">
          {dummyTestimonials.map((testimonial, index) => (
            <TestimonialCard testimonial={testimonial} key={index} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Testimonials;
