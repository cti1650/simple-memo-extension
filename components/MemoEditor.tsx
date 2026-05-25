import { useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type Props = {
  index: number;
  /** textarea を残りスペースいっぱいに拡張するか */
  fill?: boolean;
};

export const MemoEditor = ({ index, fill = false }: Props) => {
  const [title, setTitle] = useLocalStorage<string>(`title_${index}`, '');
  const [value, setValue] = useLocalStorage<string>(String(index), '');

  const handleChangeTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      setTitle((prev) => (prev !== next ? next : prev));
    },
    [setTitle],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const next = e.target.value;
      setValue((prev) => (prev !== next ? next : prev));
    },
    [setValue],
  );

  const length = value?.length ?? 0;

  return (
    <div className={`w-full flex flex-col gap-2 ${fill ? 'h-full min-h-0' : ''}`}>
      <label className="text-sm select-none flex flex-col gap-1">
        <span className="text-gray-600">Title</span>
        <input
          type="text"
          onChange={handleChangeTitle}
          className="w-full px-2 py-1 text-lg break-all border border-gray-200 rounded-lg inset-shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={title ?? ''}
          placeholder={`タブ ${index} のタイトル`}
        />
      </label>
      <label className={`text-sm select-none flex flex-col gap-1 ${fill ? 'flex-1 min-h-0' : ''}`}>
        <span className="text-gray-600">Memo</span>
        <textarea
          onChange={handleChange}
          className={`w-full p-2 text-lg break-all border border-gray-200 rounded-lg inset-shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none ${
            fill ? 'flex-1 min-h-0' : ''
          }`}
          style={fill ? undefined : { height: '430px' }}
          value={value ?? ''}
          placeholder="ここにメモを入力"
        />
      </label>
      <div className="text-xs text-gray-500 text-right select-none">{length} 文字</div>
    </div>
  );
};
