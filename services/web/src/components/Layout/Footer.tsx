import Link from 'next/link';
import Button from '../Button';
import Typography from '../Typography';

const quickLinks: [string, string][] = [
  ['Home', '/'],
  ['About', '/about'],
  ['Facilities', '/facilities'],
  ['Pricing', '/pricing'],
  ['Contact', '/contact'],
];

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="border-white border-t-[1px] bg-black">
      <div className="flex container justify-between my-12 flex-col-reverse md:flex-row">
        <nav>
          <ul>
            {quickLinks.map((link, index) => (
              <li key={index}>
                <Link href={link[1]}>
                  <Typography as="span" styledAs="navLink">
                    {link[0]}
                  </Typography>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col justify-between items-end">
          <label className="flex flex-col w-full">
            <span>Subscribe to our newsletter</span>
            <div className="flex">
              <input type="text" className="grow" />
              <Button intent="primary">Submit</Button>
            </div>
          </label>
          <span className="underline cursor-pointer" onClick={scrollToTop}>
            back to top
          </span>
        </div>
      </div>
      <div className="border-white border-t-[1px]">
        <div className="container py-8 flex justify-between text-sm flex-col md:flex-row items-center">
          <span>{'© Hot tomato dev team 2023'}</span>
          <Link href="/privacy-policy">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
