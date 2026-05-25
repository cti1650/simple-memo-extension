import { useCallback } from 'react';
import { activeTabItem, TAB_COUNT } from '@/lib/storage';
import { useStorage } from './useStorage';

export { TAB_COUNT };

export function useActiveTab() {
  const [active, setStored] = useStorage(activeTabItem);

  const setActive = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(TAB_COUNT - 1, index));
      if (clamped !== active) setStored(clamped);
    },
    [active, setStored],
  );

  return { active, setActive };
}
