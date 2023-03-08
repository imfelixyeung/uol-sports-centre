import {type NextPage} from 'next';
import LandingPage from '~/components/LandingPage/LandingPage';
import Seo from '~/components/Seo';

const Home: NextPage = () => {
  return (
    <>
      <Seo />
      <LandingPage />
    </>
  );
};

export default Home;
