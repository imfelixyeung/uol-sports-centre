import {Item, Root} from '@radix-ui/react-toggle-group';
import clsx from 'clsx';
import type {IconType} from './Icons/types';

const IconToggleGroup = <T extends string>({
  items,
  onValueChange,
  value,
}: {
  items: {
    Icon: IconType;
    value: T;
    label: string;
  }[];
  onValueChange?: (value: T) => void;
  value?: T;
}) => {
  return (
    <Root
      type="single"
      className="flex items-center gap-2 bg-black p-2"
      onValueChange={value => value && onValueChange?.(value as T)}
      value={value}
    >
      {items.map(item => {
        const {Icon, value, label} = item;
        return (
          <Item
            value={value}
            aria-label={label}
            title={label}
            key={value}
            className={clsx(
              'grid aspect-square h-8 cursor-pointer place-items-center',
              'bg-white data-[state=on]:bg-primary'
            )}
          >
            <Icon className="aspect-square h-5" />
          </Item>
        );
      })}
    </Root>
  );
};

export default IconToggleGroup;
