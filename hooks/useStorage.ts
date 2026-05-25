import { useCallback, useEffect, useState } from 'react';

type StorageItemLike<T> = {
  fallback: T;
  getValue(): Promise<T>;
  setValue(value: T): Promise<void>;
  watch(callback: (newValue: T, oldValue: T) => void): () => void;
};

/**
 * `storage.defineItem` で定義した item を React 状態に同期する。
 *
 * - `fallback` を初期表示として返し、マウント後に実値で更新
 * - `watch` 購読により別 context (popup/options/sidepanel) の編集も即反映
 * - item の参照が変わったら（タブ切替で別 item を渡された等）再購読
 */
export function useStorage<T>(item: StorageItemLike<T>): [T, (next: T) => void] {
  const [value, setValue] = useState<T>(item.fallback);

  // item が切り替わった瞬間に古い値が見えないよう、render 中に fallback へリセット
  const [currentItem, setCurrentItem] = useState(item);
  if (currentItem !== item) {
    setCurrentItem(item);
    setValue(item.fallback);
  }

  useEffect(() => {
    let mounted = true;
    item.getValue().then((v) => {
      if (mounted) setValue(v);
    });
    const unwatch = item.watch((next) => {
      if (mounted) setValue(next);
    });
    return () => {
      mounted = false;
      unwatch();
    };
  }, [item]);

  const update = useCallback(
    (next: T) => {
      setValue(next);
      void item.setValue(next);
    },
    [item],
  );

  return [value, update];
}
