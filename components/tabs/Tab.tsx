import cc from 'classcat';
import { useCallback, useEffect, useState } from 'react';
import { useLocalStorageData } from '@/hooks/useLocalStorage';

type PageTabProp = {
  focus?: boolean;
  index: number;
  onTabClick?: (index: number) => void;
};

export const PageTab = ({ focus = false, index, onTabClick }: PageTabProp) => {
  const [getTabTitle] = useLocalStorageData<string>(`title_${index}`);
  const [getTabValue] = useLocalStorageData<string>(String(index));
  const [title, setTitle] = useState('');
  const [havingData, setHavingData] = useState(false);

  const handleTabClick = useCallback(() => {
    if (!focus) onTabClick?.(index);
  }, [onTabClick, focus, index]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-read storage when focus changes
  useEffect(() => {
    setHavingData(Boolean(getTabValue() || getTabTitle()));
    setTitle(getTabTitle() ?? '');
  }, [focus]);

  return (
    <button
      type="button"
      title={title}
      className={cc([
        'w-full py-0.5 text-xl text-center border border-gray-200 rounded-t-lg select-none focus:outline-none',
        {
          'bg-gray-400': !havingData && !focus,
          'bg-white inset-shadow-sm': havingData && !focus,
          'bg-blue-400 shadow-sm': focus,
        },
      ])}
      onClick={handleTabClick}
    >
      {index}
    </button>
  );
};
