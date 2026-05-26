import { useCallback, useEffect, useRef, useState } from 'react';

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
 * - 連続入力時の自エコー対策: setValue で出した値を FIFO キューに積み、
 *   watch で同じ値が返ってきたらキューから取り出して setState を抑止する。
 *   これにより「t=0で 'A'、t=10で 'AB' と打って、t=15に 'A' の watch が
 *   遅れて届いて state が一瞬 'A' に巻き戻る」現象を防ぐ。
 */
export function useStorage<T>(item: StorageItemLike<T>): [T, (next: T) => void] {
  const [value, setValue] = useState<T>(item.fallback);
  const pendingWrites = useRef<T[]>([]);

  // item が切り替わった瞬間に古い値が見えないよう、render 中に fallback へリセット
  const [currentItem, setCurrentItem] = useState(item);
  if (currentItem !== item) {
    setCurrentItem(item);
    setValue(item.fallback);
    pendingWrites.current = [];
  }

  useEffect(() => {
    let mounted = true;
    item.getValue().then((v) => {
      if (mounted) setValue(v);
    });
    const unwatch = item.watch((next) => {
      if (!mounted) return;
      // 自分自身の書き込みのエコー: 先頭から取り出して setState を抑止
      if (pendingWrites.current.length > 0 && pendingWrites.current[0] === next) {
        pendingWrites.current.shift();
        return;
      }
      // 別 context 起源の更新: 保留中の自エコーは古いので破棄して受け入れ
      pendingWrites.current = [];
      setValue(next);
    });
    return () => {
      mounted = false;
      unwatch();
    };
  }, [item]);

  const update = useCallback(
    (next: T) => {
      setValue(next);
      pendingWrites.current.push(next);
      void item.setValue(next);
    },
    [item],
  );

  return [value, update];
}
