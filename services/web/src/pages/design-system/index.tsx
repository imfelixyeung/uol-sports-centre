import Link from 'next/link';
import {buttonStyles} from '~/components/Button';
import Seo from '~/components/Seo';
import Typography from '~/components/Typography';

const DesignSystemPage = () => {
  return (
    <>
      <Seo title="Design System" />
      <div className="container my-16 grid gap-3 text-center">
        <Typography as="h1">Design System</Typography>
        <Link
          className={buttonStyles({intent: 'primary'})}
          href="/design-system/components"
        >
          Components
        </Link>
        <Link
          className={buttonStyles({intent: 'primary'})}
          href="/design-system/style-guide"
        >
          Style Guide
        </Link>
      </div>
    </>
  );
};

export default DesignSystemPage;
