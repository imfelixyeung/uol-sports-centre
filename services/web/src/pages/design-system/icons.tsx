import CalendarIcon from '~/components/Icons/CalendarIcon';
import ChevronDoubleRightBorderedIcon from '~/components/Icons/ChevronTripleRightBorderedIcon';
import ChevronTripleRightIcon from '~/components/Icons/ChevronTripleRightIcon';
import ClockIcon from '~/components/Icons/ClockIcon';
import CounterIcon from '~/components/Icons/CounterIcon';
import GridIcon from '~/components/Icons/GridIcon';
import ListIcon from '~/components/Icons/ListIcon';
import Typography from '~/components/Typography';

const icons = [
  {name: 'Calendar', icon: CalendarIcon},
  {name: 'Chevron Triple Right', icon: ChevronTripleRightIcon},
  {
    name: 'Chevron Double Right Bordered',
    icon: ChevronDoubleRightBorderedIcon,
  },
  {name: 'Clock', icon: ClockIcon},
  {name: 'Grid', icon: GridIcon},
  {name: 'List', icon: ListIcon},
  {name: 'Counter', icon: CounterIcon},
];

const IconsPage = () => {
  return (
    <div className="flex grow flex-col bg-white text-black">
      <div className="container my-8">
        <Typography.h1>Icons</Typography.h1>
        <div className="flex flex-wrap gap-3">
          {icons.map((icon, index) => {
            return (
              <div
                key={index}
                className="flex items-center gap-3 bg-black p-3 text-primary"
              >
                <icon.icon className="h-8" />
                <Typography.span className="font-bold">
                  {icon.name}
                </Typography.span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default IconsPage;
