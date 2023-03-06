import {Root, Scrollbar, Thumb, Viewport} from '@radix-ui/react-scroll-area';
import type {FC, PropsWithChildren} from 'react';

const ScrollArea: FC<PropsWithChildren> = ({children}) => (
  <Root type="always">
    <Viewport>{children}</Viewport>
    <Scrollbar
      className="h-1 flex items-center bg-base-100/30"
      orientation="horizontal"
    >
      <Thumb className="!h-2 bg-primary" />
    </Scrollbar>
  </Root>
);

export default ScrollArea;
