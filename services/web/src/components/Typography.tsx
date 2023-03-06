import type {VariantProps} from 'class-variance-authority';
import {cva} from 'class-variance-authority';
import type {FC, HTMLAttributes, ReactHTML} from 'react';
import {createElement} from 'react';

const typographyStyles = cva('', {
  variants: {
    styledAs: {
      display: 'text-8xl font-black tracking-wide font-display',
      h1: 'text-6xl font-bold font-display',
      h2: 'text-5xl font-bold font-display',
      h3: 'text-4xl font-bold font-display',
      h4: 'text-3xl font-bold font-display',
      h5: 'text-2xl font-bold font-display',
      h6: 'text-xl font-bold font-display',
      p: 'text-base font-normal',
    },
  },
});

export interface TypographyProps
  extends VariantProps<typeof typographyStyles>,
    HTMLAttributes<HTMLHeadingElement> {
  as?: keyof ReactHTML;
}

const Typography: FC<TypographyProps> = ({
  styledAs,
  as: is = 'p',
  ...props
}) => {
  const element = createElement(is, {
    className: typographyStyles({
      styledAs: (styledAs ?? is) as TypographyProps['styledAs'],
    }),
    ...props,
  });
  return element;
};

export default Typography;
