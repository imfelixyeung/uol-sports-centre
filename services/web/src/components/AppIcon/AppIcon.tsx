import GymIcon from './GymIcon';

const AppIcon = () => {
  return (
    <div className="flex items-center gap-3">
      <GymIcon />
      <span className="text-[2.25rem] font-[700] uppercase leading-[1.875rem]">
        Sports
        <br />
        Centre
      </span>
    </div>
  );
};

export default AppIcon;
