import type {FC} from 'react';
import ScrollArea from './ScrollArea';

const Json: FC<{
  data: unknown;
}> = ({data}) => {
  return (
    <ScrollArea>
      <pre className="mb-3 flex bg-black p-3 text-white">
        <code className="break-words">{JSON.stringify(data, null, 2)}</code>
      </pre>
    </ScrollArea>
  );
};

export default Json;
