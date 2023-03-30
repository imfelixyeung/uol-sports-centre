import type {VariantProps} from 'class-variance-authority';
import {cva} from 'class-variance-authority';
import type {ButtonHTMLAttributes, FC} from 'react';
import {typographyStyles} from './Typography';

export const buttonStyles = cva(
  ['flex items-center justify-center', typographyStyles({styledAs: 'button'})],
  {
    variants: {
      intent: {
        primary: 'bg-primary text-black',
        secondary: 'bg-secondary text-black',
        danger: 'bg-danger text-white',
      },
      wide: {
        true: 'min-w-[12rem]',
      },
      outline: {
        true: 'border-2 border-black',
      },
      square: {
        true: 'p-2',
        false: 'px-6 py-2',
      },
    },
    defaultVariants: {
      square: false,
      outline: false,
    },
  }
);

export type ButtonProps = VariantProps<typeof buttonStyles> &
  ButtonHTMLAttributes<HTMLButtonElement>;

const Button: FC<ButtonProps> = ({
  intent,
  wide,
  className,
  square,
  outline,
  ...props
}) => {
  return (
    <button
      className={buttonStyles({intent, wide, className, square, outline})}
      {...props}
    />
  );
};

export default Button;
