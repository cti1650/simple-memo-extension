import { useCallback, useEffect, useState } from 'react';

const PREFIX = 'simple-memo-';

type Updater<T> = T | ((prev: T) => T);
type Stored<T> = { key: string; value: T };

function readFromStorage<T>(prefixedKey: string, fallback: T | (() => T)): T {
  const raw = localStorage.getItem(prefixedKey);
  if (raw !== null) {
    try {
      return JSON.parse(raw) as T;
    } catch {
      // fall through to fallback
    }
  }
  return typeof fallback === 'function' ? (fallback as () => T)() : fallback;
}

/**
 * localStorage に値を同期するフック。
 *
 * `key` が render の途中で変化しても、別キーの値で上書きしないよう
 * state に key を埋め込んでおき、save effect で必ず一致確認する。
 */
export function useLocalStorage<T>(
  key: string | number,
  initialValue: T | (() => T),
): [T, (value: Updater<T>) => void] {
  const prefixedKey = PREFIX + key;

  const [stored, setStored] = useState<Stored<T>>(() => ({
    key: prefixedKey,
    value: readFromStorage<T>(prefixedKey, initialValue),
  }));

  // key prop が変わったら同じ render 内で新 key の値を読み直す。
  // 古い state を表示する frame をゼロにするため、計算した値をそのまま返す。
  let currentValue = stored.value;
  if (stored.key !== prefixedKey) {
    currentValue = readFromStorage<T>(prefixedKey, initialValue);
    setStored({ key: prefixedKey, value: currentValue });
  }

  useEffect(() => {
    // state が前 key のものなら書き込まない（クロスキー上書きの防止）。
    if (stored.key !== prefixedKey) return;
    localStorage.setItem(prefixedKey, JSON.stringify(stored.value));
  }, [prefixedKey, stored]);

  const update = useCallback((next: Updater<T>) => {
    setStored((prev) => {
      const nextValue = typeof next === 'function' ? (next as (p: T) => T)(prev.value) : next;
      return { key: prev.key, value: nextValue };
    });
  }, []);

  return [currentValue, update];
}

export function useLocalStorageData<T>(key: string | number): [() => T | null] {
  const prefixedKey = PREFIX + key;
  const getValue = useCallback((): T | null => {
    const raw = localStorage.getItem(prefixedKey);
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }, [prefixedKey]);
  return [getValue];
}
