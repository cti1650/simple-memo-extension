import { useCallback } from 'react';

type Orientation = 'horizontal' | 'vertical';

/**
 * `role=tablist` の中で矢印キー / Home / End によるタブ切替を実装する。
 * - 横並びは ArrowLeft/ArrowRight、縦並びは ArrowUp/ArrowDown
 * - Home/End で先頭/末尾へ
 * - フォーカスも該当の `[role=tab]` ボタンへ移動する (roving tabindex 補完)
 */
export function useTabKeyboardNav(
  active: number,
  count: number,
  onSelect: (index: number) => void,
  orientation: Orientation = 'horizontal',
) {
  return useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      const prevKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
      const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';

      let target: number | null = null;
      if (e.key === nextKey) target = (active + 1) % count;
      else if (e.key === prevKey) target = (active - 1 + count) % count;
      else if (e.key === 'Home') target = 0;
      else if (e.key === 'End') target = count - 1;

      if (target === null) return;
      e.preventDefault();
      onSelect(target);

      // ボタンへフォーカス移動 (roving tabindex)
      const list = e.currentTarget;
      const buttons = list.querySelectorAll<HTMLElement>('[role="tab"], [data-tab-row]');
      buttons[target]?.focus();
    },
    [active, count, onSelect, orientation],
  );
}
