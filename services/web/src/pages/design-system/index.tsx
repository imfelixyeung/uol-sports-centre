import Link from 'next/link';
import {buttonStyles} from '~/components/Button';
import Seo from '~/components/Seo';
import Typography from '~/components/Typography';

const links = [
  {
    href: '/design-system/components',
    label: 'Components',
  },
  {
    href: '/design-system/style-guide',
    label: 'Style Guide',
  },
  {
    href: '/design-system/icons',
    label: 'Icons',
  },
];

const DesignSystemPage = () => {
  return (
    <>
      <Seo title="Design System" />
      <div className="container my-16 grid gap-3 text-center">
        <Typography.h1>Design System</Typography.h1>
        {links.map((link, index) => (
          <Link
            key={index}
            className={buttonStyles({intent: 'primary'})}
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </>
  );
};

export default DesignSystemPage;
