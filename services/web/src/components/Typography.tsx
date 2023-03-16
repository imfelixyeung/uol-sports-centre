import type {VariantProps} from 'class-variance-authority';
import {cva} from 'class-variance-authority';
import type {FC, HTMLAttributes, ReactHTML} from 'react';
import {createElement} from 'react';

export const typographyStyles = cva('', {
  variants: {
    styledAs: {
      display1: 'typography-display1',
      display2: 'typography-display2',
      subtext: 'typography-subtext',
      h1: 'typography-h1',
      h2: 'typography-h2',
      h3: 'typography-h3',
      p: 'typography-p',
      smallP: 'typography-p-small',
      navLink: 'typography-link-nav',
      footerLink: 'typography-link-footer',
      button: 'typography-button',
      data: 'typography-data',
    },
    desktopStyledAs: {
      display1: 'md:typography-display1',
      display2: 'md:typography-display2',
      subtext: 'md:typography-subtext',
      h1: 'md:typography-h1',
      h2: 'md:typography-h2',
      h3: 'md:typography-h3',
      p: 'md:typography-p',
      navLink: 'md:typography-link-nav',
      footerLink: 'md:typography-link-footer',
      button: 'md:typography-button',
      data: 'md:typography-data',
    },
    uppercase: {
      true: 'uppercase',
    },
  },
});

export type TypographyStyleProps = VariantProps<typeof typographyStyles>;

export interface TypographyProps
  extends TypographyStyleProps,
    HTMLAttributes<HTMLHeadingElement> {
  as?: keyof ReactHTML;
}
export type TypographyTags = {
  h1: FC<Omit<TypographyProps, 'as'>>;
  h2: FC<Omit<TypographyProps, 'as'>>;
  h3: FC<Omit<TypographyProps, 'as'>>;
  h4: FC<Omit<TypographyProps, 'as'>>;
  h5: FC<Omit<TypographyProps, 'as'>>;
  h6: FC<Omit<TypographyProps, 'as'>>;
  p: FC<Omit<TypographyProps, 'as'>>;
  span: FC<Omit<TypographyProps, 'as'>>;
};

const Typography: FC<TypographyProps> & TypographyTags = ({
  styledAs,
  desktopStyledAs,
  uppercase,
  as: is = 'p',
  className,
  ...props
}) => {
  const element = createElement(is, {
    className: typographyStyles({
      styledAs: (styledAs ?? is) as TypographyProps['styledAs'],
      desktopStyledAs,
      uppercase,
      className,
    }),
    ...props,
  });
  return element;
};

Typography.h1 = props => <Typography as="h1" {...props} />;
Typography.h2 = props => <Typography as="h2" {...props} />;
Typography.h3 = props => <Typography as="h3" {...props} />;
Typography.h4 = props => <Typography as="h4" {...props} />;
Typography.h5 = props => <Typography as="h5" {...props} />;
Typography.h6 = props => <Typography as="h6" {...props} />;
Typography.p = props => <Typography as="p" {...props} />;
Typography.span = props => <Typography as="span" {...props} />;

export default Typography;
