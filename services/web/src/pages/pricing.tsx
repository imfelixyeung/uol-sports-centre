import PageHero from '~/components/PageHero';
import Typography from '~/components/Typography';

const PricingPage = () => {
  // TODO: Populate Page
  return (
    <>
      <PageHero title="Pricing" />
      <div className="container my-8">
        <Typography.h2>Facilities Prices</Typography.h2>
        <div className="grid min-h-[25rem] w-full place-items-center ring-2 ring-inset ring-white">
          Table of prices for all facilities
        </div>
        <Typography.h2>Activities Prices</Typography.h2>
        <div className="grid min-h-[25rem] w-full place-items-center ring-2 ring-inset ring-white">
          Table of prices for all activities
        </div>
      </div>
    </>
  );
};

export default PricingPage;
