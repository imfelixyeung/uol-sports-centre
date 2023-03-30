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
  side?: ReactNode;
}

const PageHero: FC<PageHeroProps> = ({
  title,
  titleStyles = {
    styledAs: 'h2',
    desktopStyledAs: 'display2',
    uppercase: true,
  },
  subtitle,
  subtitleStyles = {
    styledAs: 'subtext',
    uppercase: true,
  },
  actions,
  backgroundImage = '/assets/images/patterns/hero.svg',
  side,
}) => {
  return (
    <div className="relative">
      <div className="bg-gradient-to-r from-black via-black/95 to-black/50">
        <div className="container grid md:grid-cols-2">
          <div className="flex flex-col justify-center gap-6 py-16">
            <Typography.h1 {...titleStyles} className="mb-3">
              {title}
            </Typography.h1>
            {subtitle && (
              <Typography.p {...subtitleStyles}>{subtitle}</Typography.p>
            )}
            {actions && (
              <div className="flex flex-col gap-3 md:flex-row">{actions}</div>
            )}
          </div>
          {side && (
            <div className="flex items-center justify-center py-16">{side}</div>
          )}
        </div>
      </div>
      {backgroundImage && (
        <img
          className="absolute inset-0 -z-10 h-full w-full bg-black object-cover object-center"
          src={backgroundImage}
          alt="Hero Section Background"
          loading="lazy"
        />
      )}
    </div>
  );
};

export default PageHero;
