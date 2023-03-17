import {ProductCarousel} from '../ProductCarousel';
import Typography from '../Typography';

const Classes = () => {
  return (
    <div className="bg-white text-black">
      <div className="container flex flex-col gap-6 py-8">
        <Typography.h2 styledAs="h1" uppercase>
          {'/// Classes'}
        </Typography.h2>
        <ProductCarousel
          products={[
            {
              image: '/assets/images/pexels-alexy-almond-3756521.jpg',
              name: 'Pilates',
              description:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, ea facere. Sapiente enim, nisi maiores repellendus ipsum explicabo itaque ducimus provident accusamus odio amet dolorum tenetur facilis obcaecati ea velit?',
              url: '#',
            },
            {
              image: '/assets/images/pexels-gustavo-fring-3984337.jpg',
              name: 'Yoga',
              description:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, ea facere. Sapiente enim, nisi maiores repellendus ipsum explicabo itaque ducimus provident accusamus odio amet dolorum tenetur facilis obcaecati ea velit?',
              url: '#',
            },
            {
              image: '/assets/images/pexels-andrea-piacquadio-903171.jpg',
              name: 'Aerobics',
              description:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, ea facere. Sapiente enim, nisi maiores repellendus ipsum explicabo itaque ducimus provident accusamus odio amet dolorum tenetur facilis obcaecati ea velit?',
              url: '#',
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Classes;
