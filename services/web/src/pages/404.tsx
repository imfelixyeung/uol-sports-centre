import Typography from '~/components/Typography';

const NotFoundPage = () => {
  return (
    <div className="my-32 flex grow flex-col items-center justify-center gap-3">
      <Typography as="h1">404</Typography>
      <Typography as="p">Page not found</Typography>
    </div>
  );
};

export default NotFoundPage;
