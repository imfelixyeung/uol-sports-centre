import type {VariantProps} from 'class-variance-authority';
import {cva} from 'class-variance-authority';
import type {ButtonHTMLAttributes, FC} from 'react';

const buttonStyles = cva(
  'px-6 py-3 flex items-center justify-center font-bold',
  {
    variants: {
      intent: {
        primary: 'bg-primary',
        secondary: 'bg-secondary',
      },
      wide: {
        true: 'min-w-[12rem]',
      },
    },
  }
);

export type ButtonProps = VariantProps<typeof buttonStyles> &
  ButtonHTMLAttributes<HTMLButtonElement>;

const Button: FC<ButtonProps> = ({intent, wide, className, ...props}) => {
  return (
    <button className={buttonStyles({intent, wide, className})} {...props} />
  );
};

export default Button;
