import type {FC} from 'react';
import ChevronDoubleRightBorderedIcon from '../Icons/ChevronTripleRightBorderedIcon';
import Typography from '../Typography';
import type {Product} from './types';

export interface ProductCardProps {
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
        <Typography.h3 styledAs="h2" uppercase>
          {name}
        </Typography.h3>
        <ChevronDoubleRightBorderedIcon
          className="h-6 stroke-[6] text-primary"
          aria-hidden
        />
      </div>
      <Typography.p className="text-justify">{description}</Typography.p>
    </a>
  );
};

export default ProductCard;
