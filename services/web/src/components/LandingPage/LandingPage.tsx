import Marquee from '../Marquee';
import Classes from './Classes';
import Facilities from './Facilities';
import Gallery from './Gallery';
import Hero from './Hero';
import Memberships from './Memberships';
import ReachGoals from './ReachGoals';
import Socials from './Socials';
import {Testimonials} from './Testimonials';

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
      <section>
        <Facilities />
      </section>
      <section>
        <Memberships />
      </section>
      <section>
        <Classes />
      </section>
      <section>
        <Testimonials />
      </section>
      <section>
        <Gallery />
      </section>
      <section>
        <Socials />
      </section>
    </>
  );
};

export default LandingPage;
