import type {GetServerSideProps} from 'next';

// default export required for next.js to not throw errors
const Health = () => {
  return <div>Ok</div>;
};

export default Health;

export const getServerSideProps: GetServerSideProps = context => {
  const {res} = context;

  res.setHeader('Content-Type', 'application/json');
  res.write(
    JSON.stringify({
      status: 'healthy', // we are healthy as long as we are running
    })
  );
  res.end();

  // return values are needed for typescript and eslint
  return Promise.resolve({
    props: {},
  });
};
