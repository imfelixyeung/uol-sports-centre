import Link from 'next/link';
import {buttonStyles} from '../Button';
import PageHero from '../PageHero';

const Hero = () => {
  return (
    <PageHero
      title="A Sports Centre"
      titleStyles={{
        styledAs: 'display2',
        desktopStyledAs: 'display1',
        uppercase: true,
      }}
      subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo
                optio non veritatis natus necessitatibus iure omnis ratione quae
                unde facilis soluta consequuntur repellendus excepturi, libero
                fugit at ipsa repudiandae dolore!"
      subtitleStyles={{
        styledAs: 'p',
        uppercase: false,
      }}
      actions={
        <>
          <Link
            href="/auth/register"
            className={buttonStyles({
              intent: 'primary',
              className: 'w-full md:w-auto',
            })}
          >
            Join Us
          </Link>
          <Link
            href="/facilities"
            className={buttonStyles({
              intent: 'secondary',
              className: 'w-full md:w-auto',
            })}
          >
            Facilities
          </Link>
        </>
      }
      backgroundImage="/assets/images/pexels-max-rahubovskiy-7031705.jpg"
    />
  );
};

export default Hero;
