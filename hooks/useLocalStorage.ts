import { useCallback, useEffect, useState } from 'react';

const PREFIX = 'simple-memo-';

type Updater<T> = T | ((prev: T | null) => T | null);

export function useLocalStorage<T>(
  key: string | number,
  initialValue: T | (() => T),
): [T | null, (value: Updater<T>) => void] {
  const prefixedKey = PREFIX + key;
  const [value, setValue] = useState<T | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: initialize once per key
  useEffect(() => {
    const jsonValue = localStorage.getItem(prefixedKey);
    if (jsonValue !== null) {
      try {
        setValue(JSON.parse(jsonValue) as T);
        return;
      } catch {
        // fall through to initial
      }
    }
    setValue(typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue);
  }, [prefixedKey]);

  useEffect(() => {
    if (value === null) return;
    localStorage.setItem(prefixedKey, JSON.stringify(value));
  }, [prefixedKey, value]);

  const update = useCallback((next: Updater<T>) => {
    setValue((prev) =>
      typeof next === 'function' ? (next as (p: T | null) => T | null)(prev) : next,
    );
  }, []);

  return [value, update];
}

export function useLocalStorageData<T>(key: string | number): [() => T | null] {
  const prefixedKey = PREFIX + key;
  const getValue = useCallback((): T | null => {
    const jsonValue = localStorage.getItem(prefixedKey);
    if (jsonValue === null) return null;
    try {
      return JSON.parse(jsonValue) as T;
    } catch {
      return null;
    }
  }, [prefixedKey]);
  return [getValue];
}
