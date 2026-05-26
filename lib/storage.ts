import { storage } from '#imports';

export const TAB_COUNT = 10;

/**
 * すべての永続データを `storage.defineItem` で集約定義する。
 * - 型・キー名・初期値が1箇所に集まり、コンポーネント側は item 参照のみ。
 * - `chrome.storage.local` を経由するため popup/options/sidepanel 間で
 *   `watch` によるライブ同期が成立する。
 */

export const titleItems = Array.from({ length: TAB_COUNT }, (_, index) =>
  storage.defineItem<string>(`local:title_${index}`, { fallback: '' }),
);

export const memoItems = Array.from({ length: TAB_COUNT }, (_, index) =>
  storage.defineItem<string>(`local:memo_${index}`, { fallback: '' }),
);

export const activeTabItem = storage.defineItem<number>('local:active_tab', {
  fallback: 0,
});
