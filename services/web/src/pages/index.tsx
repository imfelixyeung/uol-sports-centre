import {type NextPage} from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sports Centre Management System</title>
      </Head>
      <main className="to flex min-h-screen w-screen items-center justify-center bg-gradient-to-br from-fuchsia-600 to-orange-600 p-6 text-white">
        <h1 className="text-4xl font-bold md:text-6xl">
          Sports Centre Management System
        </h1>
      </main>
    </>
  );
};

export default Home;
