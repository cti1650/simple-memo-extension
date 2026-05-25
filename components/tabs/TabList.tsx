import cc from 'classcat';
import { useStorage } from '@/hooks/useStorage';
import { memoItems, titleItems } from '@/lib/storage';

type Props = {
  active: number;
  count: number;
  onSelect: (index: number) => void;
};

export const TabList = ({ active, count, onSelect }: Props) => {
  return (
    <nav aria-label="メモタブ" className="flex flex-col gap-1 p-2">
      {Array.from({ length: count }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: index is the stable tab identifier
        <TabRow key={index} index={index} focus={index === active} onSelect={onSelect} />
      ))}
    </nav>
  );
};

type TabRowProps = {
  index: number;
  focus: boolean;
  onSelect: (index: number) => void;
};

const TabRow = ({ index, focus, onSelect }: TabRowProps) => {
  const [title] = useStorage(titleItems[index]);
  const [memo] = useStorage(memoItems[index]);
  const hasData = Boolean(title || memo);
  const preview = title || memo.replace(/\s+/g, ' ').slice(0, 60) || '(空)';

  return (
    <button
      type="button"
      aria-current={focus ? 'page' : undefined}
      className={cc([
        'flex flex-row items-center gap-3 px-3 py-2 text-left rounded-lg border transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
        {
          'bg-blue-500 border-blue-500 text-white shadow-sm': focus,
          'bg-white border-gray-200 hover:bg-gray-50': !focus,
        },
      ])}
      onClick={() => onSelect(index)}
    >
      <span
        className={cc([
          'w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold shrink-0',
          {
            'bg-white/20': focus,
            'bg-gray-100 text-gray-700': !focus,
          },
        ])}
      >
        {index}
      </span>
      <span className="flex-1 min-w-0 truncate text-sm">{preview}</span>
      {hasData && !focus && (
        <span aria-hidden="true" className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
      )}
    </button>
  );
};
