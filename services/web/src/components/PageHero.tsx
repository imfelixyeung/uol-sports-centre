import type {FC, ReactNode} from 'react';
import type {TypographyStyleProps} from './Typography';
import Typography from './Typography';

interface PageHeroProps {
  title: ReactNode;
  titleStyles?: TypographyStyleProps;
  subtitle?: ReactNode;
  subtitleStyles?: TypographyStyleProps;
  actions?: ReactNode;
  backgroundImage?: string;
}

const PageHero: FC<PageHeroProps> = ({
  title,
  titleStyles = {
    styledAs: 'display2',
    uppercase: true,
  },
  subtitle,
  subtitleStyles = {
    styledAs: 'subtext',
    uppercase: true,
  },
  actions,
  backgroundImage = '/assets/images/patterns/hero.svg',
}) => {
  return (
    <div className="relative">
      <div className="bg-gradient-to-r from-black via-black/95 to-black/50">
        <div className="container grid md:grid-cols-2">
          <div className="flex justify-center flex-col gap-6 py-16">
            <Typography as="h1" {...titleStyles} className="mb-3">
              {title}
            </Typography>
            {subtitle && (
              <Typography as="p" {...subtitleStyles}>
                {subtitle}
              </Typography>
            )}
            {actions && (
              <div className="flex gap-3 flex-col md:flex-row">{actions}</div>
            )}
          </div>
        </div>
      </div>
      {backgroundImage && (
        <img
          className="absolute h-full w-full inset-0 -z-10 object-cover object-center bg-black"
          src={backgroundImage}
          alt="Hero Section Background"
          loading="lazy"
        />
      )}
    </div>
  );
};

export default PageHero;
