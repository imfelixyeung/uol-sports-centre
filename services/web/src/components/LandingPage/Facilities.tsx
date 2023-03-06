import ProductCarousel from '../ProductCarousel';
import Typography from '../Typography';

const Facilities = () => {
  return (
    <div className="bg-base-content text-base-100">
      <div className="py-8 container flex flex-col gap-6">
        <Typography as="h2" styledAs="h3" uppercase>
          {'/// Facilities'}
        </Typography>
        <ProductCarousel
          products={[
            {
              image: '/assets/images/pexels-chevanon-photography-317155.jpg',
              name: 'Swimming Pool',
              description:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, ea facere. Sapiente enim, nisi maiores repellendus ipsum explicabo itaque ducimus provident accusamus odio amet dolorum tenetur facilis obcaecati ea velit?',
              url: '#',
            },
            {
              image: '/assets/images/pexels-chevanon-photography-317155.jpg',
              name: 'Fitness Room',
              description:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, ea facere. Sapiente enim, nisi maiores repellendus ipsum explicabo itaque ducimus provident accusamus odio amet dolorum tenetur facilis obcaecati ea velit?',
              url: '#',
            },
            {
              image: '/assets/images/pexels-chevanon-photography-317155.jpg',
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
