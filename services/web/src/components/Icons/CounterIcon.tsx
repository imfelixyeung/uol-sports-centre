// modified from https://icon-sets.iconify.design/mdi/counter/

import type {IconType} from './types';

const CounterIcon: IconType = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2m0 2v12h7V6H4m16 12V6h-1.24c.24.54.19 1.07.19 1.13c-.07.67-.54 1.37-.71 1.62l-2.33 2.55l3.32-.02l.01 1.22l-5.2-.03l-.04-1s3.05-3.23 3.2-3.52c.14-.28.71-1.95-.7-1.95c-1.23.05-1.09 1.3-1.09 1.3l-1.54.01s.01-.66.38-1.31H13v12h2.58l-.01-.86l.97-.01s.91-.16.92-1.05c.04-1-.81-1-.96-1c-.13 0-1.07.05-1.07.87h-1.52s.04-2.06 2.59-2.06c2.6 0 2.46 2.02 2.46 2.02s.04 1.25-1.11 1.72l.52.37H20M8.92 16h-1.5v-5.8l-1.8.56V9.53l3.14-1.12h.16V16Z" />
    </svg>
  );
};

export default CounterIcon;
