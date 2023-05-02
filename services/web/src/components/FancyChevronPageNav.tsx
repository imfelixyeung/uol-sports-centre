import clsx from 'clsx';
import Link from 'next/link';
import type {FC} from 'react';
import ChevronTripleLeftIcon from './Icons/ChevronTripleLeftIcon';
import ChevronTripleRightIcon from './Icons/ChevronTripleRightIcon';
import Typography from './Typography';

export interface FancyChevronPageNavProps {
  image: string;
  links: {
    label: string;
    url: string;
  }[];
}

const FancyChevronPageNav: FC<FancyChevronPageNavProps> = ({image, links}) => {
  return (
    <div className="container my-12">
      <div className="flex items-center justify-center gap-16">
        <img src={image} alt="" className="w-full max-w-md object-cover" />
        <div className="flex max-w-lg grow flex-col gap-6">
          {links.map((link, index) => {
            const reverse = index % 2 === 1;
            const Icon = reverse
              ? ChevronTripleLeftIcon
              : ChevronTripleRightIcon;
            return (
              <Link
                href={link.url}
                key={index}
                className={clsx(
                  'flex items-center gap-8',
                  reverse && 'flex-row-reverse'
                )}
              >
                <Typography.span styledAs="h1" uppercase>
                  {link.label}
                </Typography.span>
                <Icon className="h-8 text-primary" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FancyChevronPageNav;
