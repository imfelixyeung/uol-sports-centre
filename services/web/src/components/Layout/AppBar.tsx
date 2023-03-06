import Button from '../Button';

const AppBar = () => {
  return (
    <div className="bg-base-100">
      <header className="flex justify-between items-center container py-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-base-content"></div>
          <h1 className="uppercase font-black leading-4">
            Sports
            <br />
            Centre
          </h1>
        </div>
        <nav>
          <ul className="flex gap-6 font-bold">
            <li>
              <a href="">About</a>
            </li>
            <li>
              <a href="">Facilities</a>
            </li>
            <li>
              <a href="">Pricing</a>
            </li>
            <li>
              <a href="">Contact</a>
            </li>
          </ul>
        </nav>
        <Button intent="primary">Account</Button>
      </header>
    </div>
  );
};

export default AppBar;
