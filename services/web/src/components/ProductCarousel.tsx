import type {FC} from 'react';
import Typography from './Typography';

interface Product {
  image: string;
  name: string;
  description: string;
  url: string;
}

interface ProductCarouselProps {
  products: Product[];
}

const ProductCarousel: FC<ProductCarouselProps> = ({products}) => {
  return (
    <div className="flex max-w-full overflow-x-auto gap-6 pb-3 snap-mandatory snap-x">
      {products.map((product, index) => (
        <ProductCard product={product} key={index} />
      ))}
    </div>
  );
};

interface ProductCardProps {
  product: Product;
}

const ProductCard: FC<ProductCardProps> = ({product}) => {
  const {description, image, name, url} = product;
  return (
    <a
      className="flex flex-col min-w-full md:min-w-[25rem] gap-3 snap-center"
      href={url}
    >
      <img src={image} alt={name} className="aspect-video object-cover" />
      <Typography as="h3" styledAs="h5" uppercase>
        {name}
      </Typography>
      <Typography>{description}</Typography>
    </a>
  );
};

export default ProductCarousel;
