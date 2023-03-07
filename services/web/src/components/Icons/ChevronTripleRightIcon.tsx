import type {FC, HTMLAttributes} from 'react';

type IconProps = HTMLAttributes<SVGElement>;

const ChevronTripleRightIcon: FC<IconProps> = props => {
  return (
    <svg
      width="39"
      height="24"
      viewBox="0 0 39 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      {...props}
    >
      <path d="M24.1602 21.18L33.3402 12L24.1602 2.82L27.0002 0L39.0002 12L27.0002 24L24.1602 21.18ZM12.1602 21.18L21.3402 12L12.1602 2.82L15.0002 0L27.0002 12L15.0002 24L12.1602 21.18ZM0.160156 21.18L9.34016 12L0.160156 2.82L3.00016 0L15.0002 12L3.00016 24L0.160156 21.18Z" />
    </svg>
  );
};

export default ChevronTripleRightIcon;
