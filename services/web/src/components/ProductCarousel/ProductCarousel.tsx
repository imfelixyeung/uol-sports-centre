import type {FC} from 'react';
import ScrollArea from '../ScrollArea';
import ProductCard from './ProductCard';
import type {Product} from './types';

export interface ProductCarouselProps {
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

export default ProductCarousel;
