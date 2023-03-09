import type {FC, HTMLAttributes} from 'react';

type IconProps = HTMLAttributes<SVGElement>;

const ChevronDoubleRightBorderedIcon: FC<IconProps> = props => {
  return (
    <svg
      width="48"
      height="37"
      viewBox="0 0 48 37"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M26.9383 25.953L25.6737 27.3174L26.9431 28.6773L29.5755 31.4973L31.0427 33.0691L32.5043 31.4921L43.6269 19.4921L44.887 18.1326L43.6269 16.773L32.5043 4.773L31.0427 3.19604L29.5755 4.76784L26.9431 7.58784L25.6737 8.94775L26.9383 10.3121L34.1869 18.1326L26.9383 25.953ZM15.8158 25.953L14.5511 27.3174L15.8206 28.6773L18.4529 31.4973L19.9201 33.0691L21.3818 31.4921L32.5043 19.4921L33.7645 18.1326L32.5043 16.773L21.3818 4.773L19.9201 3.19604L18.4529 4.76784L15.8206 7.58784L14.5511 8.94775L15.8158 10.3121L23.0644 18.1326L15.8158 25.953ZM4.69321 25.953L3.42859 27.3174L4.69801 28.6773L7.33035 31.4973L8.79755 33.0691L10.2592 31.4921L21.3818 19.4921L22.6419 18.1326L21.3818 16.773L10.2592 4.773L8.79755 3.19604L7.33035 4.76784L4.69801 7.58784L3.42859 8.94775L4.69321 10.3121L11.9418 18.1326L4.69321 25.953Z"
        stroke="#1A1A1A"
        strokeWidth="4"
      />
    </svg>
  );
};

export default ChevronDoubleRightBorderedIcon;
