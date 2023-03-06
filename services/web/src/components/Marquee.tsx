import type {FC} from 'react';
import FastMarquee from 'react-fast-marquee';

interface MarqueeProps {
  statements: string[];
}

const Marquee: FC<MarqueeProps> = ({statements}) => {
  return (
    <FastMarquee
      gradient={false}
      className="bg-primary text-black font-black text-2xl p-2"
    >
      {statements.map((statement, index) => (
        <div key={index} className="mr-6 space-x-6">
          <p className="inline-block uppercase">{statement}</p>
          <span aria-hidden className="select-none">
            {'//'}
          </span>
        </div>
      ))}
    </FastMarquee>
  );
};

export default Marquee;
