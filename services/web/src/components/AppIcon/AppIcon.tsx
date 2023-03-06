import GymIcon from './GymIcon';

const AppIcon = () => {
  return (
    <div className="flex items-center gap-3">
      <GymIcon />
      <span className="uppercase font-bold leading-6 text-2xl">
        Sports
        <br />
        Centre
      </span>
    </div>
  );
};

export default AppIcon;
