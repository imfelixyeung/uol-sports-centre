import ProductCarousel from '../ProductCarousel';
import Typography from '../Typography';

const Facilities = () => {
  return (
    <div className="bg-white text-black">
      <div className="py-8 container flex flex-col gap-6">
        <Typography as="h2" styledAs="h1" uppercase>
          {'/// Facilities'}
        </Typography>
        <ProductCarousel
          products={[
            {
              image: '/assets/images/pexels-jim-de-ramos-1263349.jpg',
              name: 'Swimming Pool',
              description:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, ea facere. Sapiente enim, nisi maiores repellendus ipsum explicabo itaque ducimus provident accusamus odio amet dolorum tenetur facilis obcaecati ea velit?',
              url: '#',
            },
            {
              image: '/assets/images/pexels-max-rahubovskiy-7031706.jpg',
              name: 'Fitness Room',
              description:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, ea facere. Sapiente enim, nisi maiores repellendus ipsum explicabo itaque ducimus provident accusamus odio amet dolorum tenetur facilis obcaecati ea velit?',
              url: '#',
            },
            {
              image: '/assets/images/pexels-artem-podrez-7648084.jpg',
              name: 'Squash Courts',
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

export default Facilities;
