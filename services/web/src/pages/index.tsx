import {type NextPage} from 'next';
import Head from 'next/head';
import LandingPage from '~/components/LandingPage/LandingPage';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sports Centre Management System</title>
      </Head>
      <LandingPage />
    </>
  );
};

export default Home;
