import Typography from '~/components/Typography';

const NotFoundPage = () => {
  return (
    <div className="my-32 flex grow flex-col items-center justify-center gap-3">
      <Typography.h1>404</Typography.h1>
      <Typography.p>Page not found</Typography.p>
    </div>
  );
};

export default NotFoundPage;
