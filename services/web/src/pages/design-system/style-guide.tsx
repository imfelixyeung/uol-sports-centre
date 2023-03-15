import clsx from 'clsx';
import type {FC} from 'react';
import Seo from '~/components/Seo';
import Typography from '~/components/Typography';

const typographies = [
  {
    name: 'Display 1',
    font: 'Saira condensed',
    styledAs: 'display1',
    fontSize: '128',
    lineHeight: '100',
  },
  {
    name: 'Display 2',
    font: 'Saira condensed',
    styledAs: 'display2',
    fontSize: '80',
    lineHeight: '64',
  },
  {
    name: 'Subtext',
    font: 'Saira',
    styledAs: 'subtext',
    fontSize: '16',
    lineHeight: 'auto',
  },
  {
    name: 'H1',
    font: 'Saira condensed',
    styledAs: 'h1',
    fontSize: '52',
    lineHeight: '50',
  },
  {
    name: 'H2',
    font: 'Saira condensed',
    styledAs: 'h2',
    fontSize: '32',
    lineHeight: '36',
  },
  {
    name: 'H3',
    font: 'Saira condensed',
    styledAs: 'h3',
    fontSize: '24',
    lineHeight: '28',
  },
  {
    name: 'p',
    font: 'Saira',
    styledAs: 'p',
    fontSize: '20',
    lineHeight: 'auto',
  },
] as const;

type TypographyShowcaseData = (typeof typographies)[number];

const colours = [
  {
    name: 'White',
    hex: '#EEEEEE',
    class: 'bg-white text-black',
  },
  {
    name: 'Black',
    hex: '#1A1A1A',
    class: 'bg-black text-white',
  },
  {
    name: 'Yellowish',
    hex: '#E0FE10',
    class: 'bg-primary text-black',
  },
];

type ColourShowcaseData = (typeof colours)[number];

const StyleGuidePage = () => {
  return (
    <>
      <Seo title="Style Guide" />
      <div className="grow bg-white text-black">
        <div className="container py-16">
          <Typography.h1 styledAs="display1" uppercase>
            Style Guide
          </Typography.h1>
          <section className="mt-8">
            <Typography.h2 styledAs="display2" uppercase>
              Typography
            </Typography.h2>
            <div className="mt-8 flex flex-wrap gap-8">
              <div className="flex grow flex-col gap-3">
                {typographies.map((typography, index) => (
                  <TypographyShowcase
                    key={index}
                    typography={typography}
                    variant="dark"
                  />
                ))}
              </div>
              <div className="flex grow flex-col gap-3">
                {typographies.map((typography, index) => (
                  <TypographyShowcase
                    key={index}
                    typography={typography}
                    variant="light"
                  />
                ))}
              </div>
            </div>
          </section>
          <section className="mt-8">
            <Typography.h2 styledAs="display2" uppercase>
              Colours
            </Typography.h2>
            <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {colours.map((colour, index) => (
                <ColourShowcase key={index} colour={colour} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

const ColourShowcase: FC<{colour: ColourShowcaseData}> = ({colour}) => (
  <div className={clsx('grow p-6 text-center shadow-card', colour.class)}>
    <Typography.p styledAs="h1" uppercase>
      {colour.name}
    </Typography.p>
    <Typography.p styledAs="h2" uppercase>
      {colour.hex}
    </Typography.p>
  </div>
);

const TypographyShowcase: FC<{
  typography: TypographyShowcaseData;
  variant: 'light' | 'dark';
}> = ({typography, variant}) => (
  <div
    className={clsx(
      'space-y-3 p-3 shadow-card',
      variant === 'light' ? 'bg-white text-black' : 'bg-black text-white'
    )}
  >
    <Typography.p styledAs={typography.styledAs} uppercase>
      {typography.name}
    </Typography.p>
    <Typography.p styledAs="subtext">{typography.font}</Typography.p>
    <Typography.p styledAs="subtext">{`${typography.fontSize}/${typography.lineHeight}`}</Typography.p>
  </div>
);

export default StyleGuidePage;
