import type {VariantProps} from 'class-variance-authority';
import {cva} from 'class-variance-authority';
import type {FC, HTMLAttributes} from 'react';
import ChevronTripleRightIcon from './Icons/ChevronTripleRightIcon';
import Typography from './Typography';

const cardStyles = cva(
  'shadow-card px-3 py-6 bg-cover bg-center flex justify-end flex-col min-h-[12rem]',
  {
    variants: {
      variant: {
        default: 'bg-card text-black',
        alt: 'bg-card-alt text-black',
        red: 'bg-card-red text-white',
      },
      grow: {
        true: 'grow',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface CardProps
  extends VariantProps<typeof cardStyles>,
    HTMLAttributes<HTMLElement> {
  title: string;
}

const Card: FC<CardProps> = ({variant, title, grow, ...props}) => {
  return (
    <div className={cardStyles({variant, grow})} {...props}>
      <div className="flex items-center justify-between gap-3">
        <Typography.span styledAs="h2" uppercase className="!text-2xl">
          {title}
        </Typography.span>
        <ChevronTripleRightIcon className="h-6" />
      </div>
    </div>
  );
};

export default Card;
