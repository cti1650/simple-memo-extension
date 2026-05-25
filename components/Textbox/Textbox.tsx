import { useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type TextboxProp = {
  saveKey: number;
  openKey: number;
};

export const Textbox = ({ saveKey, openKey }: TextboxProp) => {
  const [title, setTitle] = useLocalStorage<string>(`title_${saveKey}`, '');
  const [value, setValue] = useLocalStorage<string>(String(saveKey), '');

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

  if (saveKey !== openKey) return null;

  return (
    <div className="w-full flex flex-col">
      <label className="text-sm select-none">
        Title
        <input
          type="text"
          onChange={handleChangeTitle}
          className="w-full px-2 text-lg break-all border border-gray-200 rounded-lg inset-shadow-sm focus:outline-none"
          value={title ?? ''}
        />
      </label>
      <label className="text-sm select-none">
        Memo
        <div className="min-h-full">
          <textarea
            onChange={handleChange}
            className="w-full p-2 text-lg break-all border border-gray-200 rounded-lg inset-shadow-sm focus:outline-none"
            style={{ height: '430px' }}
            value={value ?? ''}
          />
        </div>
      </label>
    </div>
  );
};
