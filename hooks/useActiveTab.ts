import { useCallback } from 'react';
import { activeTabItem, TAB_COUNT } from '@/lib/storage';
import { useStorage } from './useStorage';

export { TAB_COUNT };

function sanitizeIndex(index: unknown): number {
  if (typeof index !== 'number' || Number.isNaN(index)) return 0;
  // Infinity は Math.min/Math.max が自然にクランプしてくれる
  return Math.max(0, Math.min(TAB_COUNT - 1, Math.trunc(index)));
}

export function useActiveTab() {
  const [stored, setStored] = useStorage(activeTabItem);

  // storage 側に範囲外・非整数が入っていても安全に扱う
  const active = sanitizeIndex(stored);

  const setActive = useCallback(
    (index: number) => {
      const clamped = sanitizeIndex(index);
      if (clamped !== active) setStored(clamped);
    },
    [active, setStored],
  );

  return { active, setActive };
}
