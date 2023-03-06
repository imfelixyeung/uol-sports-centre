import ProductCarousel from '../ProductCarousel';
import Typography from '../Typography';

const Classes = () => {
  return (
    <div className="bg-base-content text-base-100">
      <div className="py-8 container flex flex-col gap-6">
        <Typography as="h2" styledAs="h3" uppercase>
          {'/// Classes'}
        </Typography>
        <ProductCarousel
          products={[
            {
              image: '/assets/images/pexels-chevanon-photography-317155.jpg',
              name: 'Pilates',
              description:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, ea facere. Sapiente enim, nisi maiores repellendus ipsum explicabo itaque ducimus provident accusamus odio amet dolorum tenetur facilis obcaecati ea velit?',
              url: '#',
            },
            {
              image: '/assets/images/pexels-chevanon-photography-317155.jpg',
              name: 'Yoga',
              description:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, ea facere. Sapiente enim, nisi maiores repellendus ipsum explicabo itaque ducimus provident accusamus odio amet dolorum tenetur facilis obcaecati ea velit?',
              url: '#',
            },
            {
              image: '/assets/images/pexels-chevanon-photography-317155.jpg',
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
