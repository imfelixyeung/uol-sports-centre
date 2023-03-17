import type {FC} from 'react';
import FastMarquee from 'react-fast-marquee';

interface MarqueeProps {
  statements: string[];
}

const Marquee: FC<MarqueeProps> = ({statements}) => {
  return (
    <FastMarquee
      gradient={false}
      className="bg-primary p-2 text-2xl font-black text-black"
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
