import Button from '../Button';

const quickLinks = ['Home', 'About', 'Facilities', 'Pricing', 'Contact'];

const Footer = () => {
  return (
    <footer className="border-white border-t-[1px] bg-black">
      <div className="flex container justify-between my-12 flex-col-reverse md:flex-row">
        <nav className="font-bold text-xl">
          <ul>
            {quickLinks.map((link, index) => (
              <li key={index}>
                <a href="">{link}</a>
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
          <span className="underline">back to top</span>
        </div>
      </div>
      <div className="border-white border-t-[1px]">
        <div className="container py-8 flex justify-between text-sm flex-col md:flex-row items-center">
          <span>{'© Hot tomato dev team 2023'}</span>
          <a href="">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
