import Marquee from '../Marquee';
import Hero from './Hero';
import ReachGoals from './ReachGoals';

const LandingPage = () => {
  return (
    <>
      <header>
        <Hero />
      </header>
      <section>
        <Marquee
          statements={[
            'A cool statement',
            'OMG its a Marquee',
            'Scrolls across the screen',
            'This will wrap',
          ]}
        />
      </section>
      <section>
        <ReachGoals />
      </section>
    </>
  );
};

export default LandingPage;
