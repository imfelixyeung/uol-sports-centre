import Button from '../Button';
import PageHero from '../PageHero';

const Hero = () => {
  return (
    <PageHero
      title="A Sports Centre"
      titleStyles={{
        styledAs: 'display1',
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
          <Button intent="primary" className="w-full md:w-auto">
            Primary CTA
          </Button>
          <Button intent="secondary" className="w-full md:w-auto">
            Secondary CTA
          </Button>
        </>
      }
      backgroundImage="/assets/images/pexels-max-rahubovskiy-7031705.jpg"
    />
  );
};

export default Hero;
