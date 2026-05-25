import { useCallback, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { PageTab } from './Tab';

type PageTabsProp = {
  pageCount?: number;
  onChange?: (index: number) => void;
  onInit?: (index: number) => void;
};

export const PageTabs = ({ pageCount = 10, onChange, onInit }: PageTabsProp) => {
  const [tabIndex, setTabIndex] = useLocalStorage<number>('tabPage', 0);

  const handleTabChange = useCallback(
    (index: number) => {
      onChange?.(index);
      setTabIndex((prev) => (prev !== index ? index : prev));
    },
    [onChange, setTabIndex],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: fire onInit once with the persisted value
  useEffect(() => {
    if (tabIndex != null) onInit?.(tabIndex);
  }, [onInit]);

  return (
    <div className="w-full">
      <div className="w-full flex flex-row">
        {pageCount > 0 &&
          Array.from({ length: pageCount }, (_, index) => (
            <PageTab
              // biome-ignore lint/suspicious/noArrayIndexKey: index is the stable tab identifier
              key={index}
              index={index}
              focus={tabIndex === index}
              onTabClick={handleTabChange}
            />
          ))}
      </div>
    </div>
  );
};
