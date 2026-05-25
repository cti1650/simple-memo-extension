import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export const TAB_COUNT = 10;

export function useActiveTab() {
  const [stored, setStored] = useLocalStorage<number>('tabPage', 0);
  const active = stored ?? 0;

  const setActive = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(TAB_COUNT - 1, index));
      setStored((prev) => (prev !== clamped ? clamped : prev));
    },
    [setStored],
  );

  return { active, setActive };
}
