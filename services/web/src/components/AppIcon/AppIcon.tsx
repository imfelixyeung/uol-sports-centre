import GymIcon from './GymIcon';

const AppIcon = () => {
  return (
    <div className="flex items-center gap-3">
      <GymIcon />
      <span className="text-2xl font-bold uppercase leading-6">
        Sports
        <br />
        Centre
      </span>
    </div>
  );
};

export default AppIcon;
