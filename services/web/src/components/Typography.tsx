import type {VariantProps} from 'class-variance-authority';
import {cva} from 'class-variance-authority';
import type {FC, HTMLAttributes, ReactHTML} from 'react';
import {createElement} from 'react';

const typographyStyles = cva('', {
  variants: {
    styledAs: {
      display1:
        'text-[8rem] leading-[6.25rem] font-black tracking-wide font-display',
      display2:
        'text-[5rem] leading-[4rem] font-black tracking-wide font-display',
      subtext: 'text-[1rem] leading-normal tracking-wide',
      h1: 'text-[3.25rem] leading-[3.125rem] font-black font-display',
      h2: 'text-[2rem] leading-[2.25rem] font-black font-display',
      p: 'text-[1.25rem] font-normal',
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
  className,
  ...props
}) => {
  const element = createElement(is, {
    className: typographyStyles({
      styledAs: (styledAs ?? is) as TypographyProps['styledAs'],
      uppercase,
      className,
    }),
    ...props,
  });
  return element;
};

export default Typography;
