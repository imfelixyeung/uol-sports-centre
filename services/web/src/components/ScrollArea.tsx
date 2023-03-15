import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline';
import {Root, Scrollbar, Thumb, Viewport} from '@radix-ui/react-scroll-area';
import type {FC, PropsWithChildren} from 'react';
import {useRef} from 'react';

interface ScrollAreaProps {
  /**
   * true to show the left right controls, show be used with scroll snapping
   *
   * defaults to false
   */
  showControls?: boolean;

  /**
   * true to always show the scrollbar, otherwise it will show only while scrolling
   *
   * defaults to true
   */
  alwaysShowScrollbar?: boolean;
}

const ScrollArea: FC<PropsWithChildren<ScrollAreaProps>> = ({
  children,
  showControls = false,
  alwaysShowScrollbar = true,
}) => {
  const viewPort = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!viewPort.current) return;

    viewPort.current.scrollBy({
      // scroll by 1px, scroll snap will take care of the rest
      left: direction === 'left' ? -1 : 1,

      // smooth to enable animation
      behavior: 'smooth',
    });
  };

  return (
    <div>
      <Root type={alwaysShowScrollbar ? 'auto' : 'scroll'}>
        <Viewport className="snap-both snap-mandatory" ref={viewPort}>
          {children}
        </Viewport>
        <Scrollbar
          className="flex h-1.5 items-center bg-black"
          orientation="horizontal"
        >
          <Thumb className="!h-4 border-4 border-black bg-primary" />
        </Scrollbar>
      </Root>
      {showControls && (
        <div className="mt-3 flex items-center justify-between">
          <div>{/* <span>1/10</span> */}</div>
          <div className="flex gap-3">
            <button onClick={() => scroll('left')}>
              <ChevronDoubleLeftIcon className="h-8 stroke-[3] text-primary" />
            </button>
            <button onClick={() => scroll('right')}>
              <ChevronDoubleRightIcon className="h-8 stroke-[3] text-primary" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrollArea;
