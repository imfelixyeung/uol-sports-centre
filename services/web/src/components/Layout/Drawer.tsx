import type {FC} from 'react';

interface DrawerProps {
  onClosed: () => void;
}

const Drawer: FC<DrawerProps> = ({onClosed}) => {
  return (
    <div className="flex flex-col gap-3 mt-16 p-2">
      <button
        onClick={onClosed}
        type="button"
        className="md:hidden p-3 bg-gray-300"
      >
        Close Menu
      </button>
      <div className="bg-teal-800 p-3 cursor-not-allowed">Profile</div>
      <div className="bg-gray-300 p-3 cursor-not-allowed">Membership</div>
      <div className="bg-gray-300 p-3 cursor-not-allowed">Facilities</div>
      <div className="bg-gray-300 p-3 cursor-not-allowed">Bookings</div>
      <div className="bg-gray-300 p-3 cursor-not-allowed">Bookings</div>
    </div>
  );
};

export default Drawer;
