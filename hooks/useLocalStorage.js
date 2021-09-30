//File that is used to save into localStorage
import { useState, useEffect, useCallback } from 'react';

const PREFIX = 'simple-memo-';

export const useLocalStorage = (key, initialValue) => {
  const prefixedKey = PREFIX + key;
  const [value, setValue] = useState(null);
  useEffect(() => {
    const jsonValue = localStorage.getItem(prefixedKey);
    if (jsonValue !== null) {
      setValue(JSON.parse(jsonValue));
    } else {
      if (typeof initialValue === 'function') {
        setValue(initialValue());
      } else {
        setValue(initialValue);
      }
    }
  }, []);
  useEffect(() => {
    localStorage.setItem(prefixedKey, JSON.stringify(value));
  }, [prefixedKey, value]);
  return [value, setValue];
};

export const useLocalStorageData = (key) => {
  const prefixedKey = PREFIX + key;
  const getValue = useCallback(() => {
    const jsonValue = localStorage.getItem(prefixedKey);
    if (jsonValue !== null) {
      return JSON.parse(jsonValue);
    } else {
      return null;
    }
  }, [key]);
  return [getValue];
};
