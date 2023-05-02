import Link from 'next/link';
import Button from '../Button';
import {StatusOverview} from '../Status';
import Typography from '../Typography';

const quickLinks = [
  {label: 'Home', href: '/'},
  {label: 'About', href: '/about'},
  {label: 'Facilities', href: '/facilities'},
  {label: 'Pricing', href: '/pricing'},
  {label: 'Contact', href: '/contact'},
];

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="border-t-[1px] border-white bg-black">
      <div className="container py-12">
        <div className="flex flex-col-reverse justify-between md:flex-row">
          <nav>
            <ul>
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>
                    <Typography.span styledAs="footerLink">
                      {link.label}
                    </Typography.span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col items-end justify-between">
            <label className="flex w-full flex-col">
              <span>Subscribe to our newsletter</span>
              <div className="flex">
                <input type="text" className="grow" />
                <Button intent="primary">Submit</Button>
              </div>
            </label>
            <span className="cursor-pointer underline" onClick={scrollToTop}>
              back to top
            </span>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <StatusOverview />
        </div>
      </div>
      <div className="border-t-[1px] border-white">
        <div className="container flex flex-col items-center justify-between py-8 text-sm md:flex-row">
          <span>{'© Hot tomato dev team 2023'}</span>
          <Link href="/privacy-policy">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
