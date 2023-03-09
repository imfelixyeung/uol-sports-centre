import {Root, Scrollbar, Thumb, Viewport} from '@radix-ui/react-scroll-area';
import type {FC, PropsWithChildren} from 'react';

const ScrollArea: FC<PropsWithChildren> = ({children}) => (
  <Root type="auto">
    <Viewport className="snap-both snap-mandatory">{children}</Viewport>
    <Scrollbar
      className="flex h-1.5 items-center bg-black"
      orientation="horizontal"
    >
      <Thumb className="!h-4 border-4 border-black bg-primary" />
    </Scrollbar>
  </Root>
);

export default ScrollArea;
