import type {VariantProps} from 'class-variance-authority';
import {cva} from 'class-variance-authority';
import type {FC, HTMLAttributes, ReactHTML} from 'react';
import {createElement} from 'react';

const typographyStyles = cva('', {
  variants: {
    styledAs: {
      display: 'text-8xl font-black tracking-wide',
      h1: 'text-6xl font-bold',
      h2: 'text-5xl font-bold',
      h3: 'text-4xl font-bold',
      h4: 'text-3xl font-bold',
      h5: 'text-2xl font-bold',
      h6: 'text-xl font-bold',
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
