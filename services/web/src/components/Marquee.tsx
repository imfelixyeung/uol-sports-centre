import type {FC} from 'react';
import FastMarquee from 'react-fast-marquee';

interface MarqueeProps {
  statements: string[];
}

const Marquee: FC<MarqueeProps> = ({statements}) => {
  return (
    <FastMarquee
      gradient={false}
      className="bg-primary text-base-100 font-black text-2xl p-2"
    >
      {statements.map((statement, index) => (
        <div key={index} className="mr-8 space-x-8">
          <p className="inline-block">{statement}</p>
          <span aria-hidden className="select-none">
            {'//'}
          </span>
        </div>
      ))}
    </FastMarquee>
  );
};

export default Marquee;
