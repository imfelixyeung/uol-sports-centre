import {ChevronDoubleRightIcon} from '@heroicons/react/24/solid';
import type {FC} from 'react';
import ScrollArea from './ScrollArea';
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
    <ScrollArea>
      <div className="flex max-w-full overflow-x-auto gap-6 pb-3 snap-mandatory snap-x">
        {products.map((product, index) => (
          <ProductCard product={product} key={index} />
        ))}
      </div>
    </ScrollArea>
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
      <div className="flex items-center justify-between">
        <Typography as="h3" styledAs="h5" uppercase>
          {name}
        </Typography>
        <ChevronDoubleRightIcon
          className="h-6 stroke-[6] text-primary"
          aria-hidden
        />
      </div>
      <Typography>{description}</Typography>
    </a>
  );
};

export default ProductCarousel;
