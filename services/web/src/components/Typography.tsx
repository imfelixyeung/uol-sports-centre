import type {VariantProps} from 'class-variance-authority';
import {cva} from 'class-variance-authority';
import type {FC, HTMLAttributes, ReactHTML} from 'react';
import {createElement} from 'react';

const typographyStyles = cva('', {
  variants: {
    styledAs: {
      display: 'text-8xl font-black tracking-wide font-display',
      h1: 'text-6xl font-black font-display',
      h2: 'text-5xl font-black font-display',
      h3: 'text-4xl font-black font-display',
      h4: 'text-3xl font-black font-display',
      h5: 'text-2xl font-black font-display',
      h6: 'text-xl font-black font-display',
      p: 'text-base font-normal',
    },
    uppercase: {
      true: 'uppercase',
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
  uppercase,
  as: is = 'p',
  ...props
}) => {
  const element = createElement(is, {
    className: typographyStyles({
      styledAs: (styledAs ?? is) as TypographyProps['styledAs'],
      uppercase,
    }),
    ...props,
  });
  return element;
};

export default Typography;
