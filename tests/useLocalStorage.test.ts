import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useLocalStorage, useLocalStorageData } from '@/hooks/useLocalStorage';

afterEach(() => {
  localStorage.clear();
});

describe('useLocalStorage', () => {
  it('returns the initial value when storage is empty', () => {
    const { result } = renderHook(() => useLocalStorage<string>('greeting', 'hello'));
    expect(result.current[0]).toBe('hello');
  });

  it('persists updates with the simple-memo- prefix', () => {
    const { result } = renderHook(() => useLocalStorage<string>('greeting', 'hello'));

    act(() => {
      result.current[1]('world');
    });

    expect(result.current[0]).toBe('world');
    expect(localStorage.getItem('simple-memo-greeting')).toBe(JSON.stringify('world'));
  });

  it('reads existing values from localStorage on mount', () => {
    localStorage.setItem('simple-memo-counter', JSON.stringify(42));
    const { result } = renderHook(() => useLocalStorage<number>('counter', 0));
    expect(result.current[0]).toBe(42);
  });
});

describe('useLocalStorageData', () => {
  it('returns null when the key is missing', () => {
    const { result } = renderHook(() => useLocalStorageData<string>('missing'));
    expect(result.current[0]()).toBeNull();
  });

  it('parses stored JSON values', () => {
    localStorage.setItem('simple-memo-saved', JSON.stringify('value'));
    const { result } = renderHook(() => useLocalStorageData<string>('saved'));
    expect(result.current[0]()).toBe('value');
  });
});
