import type {FC} from 'react';
import ChevronDoubleRightBorderedIcon from './Icons/ChevronTripleRightBorderedIcon';
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
      <div className="flex gap-6 pb-3">
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
      className="flex min-w-full snap-center flex-col gap-3 md:min-w-[25rem]"
      href={url}
    >
      <img src={image} alt={name} className="aspect-video object-cover" />
      <div className="flex items-center justify-between">
        <Typography as="h3" styledAs="h2" uppercase>
          {name}
        </Typography>
        <ChevronDoubleRightBorderedIcon
          className="h-6 stroke-[6] text-primary"
          aria-hidden
        />
      </div>
      <Typography className="text-justify">{description}</Typography>
    </a>
  );
};

export default ProductCarousel;
