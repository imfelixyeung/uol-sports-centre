import {ScrollArea} from '@radix-ui/react-scroll-area';
import type {FC} from 'react';

const Json: FC<{
  data: unknown;
}> = ({data}) => {
  return (
    <ScrollArea>
      <pre className="mb-3 bg-black p-3 text-white">
        <code className="break-words">{JSON.stringify(data, null, 2)}</code>
      </pre>
    </ScrollArea>
  );
};

export default Json;
