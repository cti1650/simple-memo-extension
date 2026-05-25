import cc from 'classcat';
import { useStorage } from '@/hooks/useStorage';
import { memoItems, titleItems } from '@/lib/storage';

type Props = {
  active: number;
  count: number;
  onSelect: (index: number) => void;
};

export const TabBar = ({ active, count, onSelect }: Props) => {
  return (
    <div role="tablist" aria-label="メモタブ" className="w-full flex flex-row">
      {Array.from({ length: count }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: index is the stable tab identifier
        <TabButton key={index} index={index} focus={index === active} onSelect={onSelect} />
      ))}
    </div>
  );
};

type TabButtonProps = {
  index: number;
  focus: boolean;
  onSelect: (index: number) => void;
};

const TabButton = ({ index, focus, onSelect }: TabButtonProps) => {
  const [title] = useStorage(titleItems[index]);
  const [memo] = useStorage(memoItems[index]);
  const hasData = Boolean(title || memo);

  return (
    <button
      type="button"
      role="tab"
      aria-selected={focus}
      title={title || `タブ ${index}`}
      className={cc([
        'relative w-full py-1 text-xl text-center border border-gray-200 rounded-t-lg select-none transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
        {
          'bg-gray-300 text-gray-700 hover:bg-gray-200': !hasData && !focus,
          'bg-white inset-shadow-sm text-gray-800 hover:bg-gray-50': hasData && !focus,
          'bg-blue-500 text-white shadow-sm': focus,
        },
      ])}
      onClick={() => onSelect(index)}
    >
      {index}
      {hasData && !focus && (
        <span
          aria-hidden="true"
          className="absolute top-1 right-1 block w-1.5 h-1.5 rounded-full bg-blue-500"
        />
      )}
    </button>
  );
};
