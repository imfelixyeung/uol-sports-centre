import Button from '../Button';
import Typography from '../Typography';

const Hero = () => {
  return (
    <div className="relative">
      <div className="bg-gradient-to-r from-base-100 via-base-100/95 to-base-100/50">
        <div className="container grid md:grid-cols-2">
          <div className="flex justify-center flex-col gap-6 py-16">
            <Typography as="h1" styledAs="display" uppercase>
              A Sports Centre
            </Typography>
            <Typography as="p">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo
              optio non veritatis natus necessitatibus iure omnis ratione quae
              unde facilis soluta consequuntur repellendus excepturi, libero
              fugit at ipsa repudiandae dolore!
            </Typography>
            <div className="flex gap-3 flex-col md:flex-row">
              <Button intent="primary" className="w-full md:w-auto">
                Primary CTA
              </Button>
              <Button intent="secondary" className="w-full md:w-auto">
                Secondary CTA
              </Button>
            </div>
          </div>
        </div>
      </div>
      <img
        className="absolute h-full w-full inset-0 -z-10 object-cover"
        src="/assets/images/pexels-max-rahubovskiy-7031705.jpg"
        alt="View of the gym"
      />
    </div>
  );
};

export default Hero;
