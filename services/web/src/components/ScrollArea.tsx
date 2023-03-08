import {Root, Scrollbar, Thumb, Viewport} from '@radix-ui/react-scroll-area';
import type {FC, PropsWithChildren} from 'react';

const ScrollArea: FC<PropsWithChildren> = ({children}) => (
  <Root type="auto">
    <Viewport className="snap-mandatory snap-both">{children}</Viewport>
    <Scrollbar
      className="h-1.5 flex items-center bg-black"
      orientation="horizontal"
    >
      <Thumb className="!h-4 bg-primary border-4 border-black" />
    </Scrollbar>
  </Root>
);

export default ScrollArea;
