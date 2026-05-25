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

  it('switches to the new key value when the key prop changes', () => {
    localStorage.setItem('simple-memo-tab-0', JSON.stringify('A'));
    localStorage.setItem('simple-memo-tab-5', JSON.stringify('B'));

    const { result, rerender } = renderHook(
      ({ key }: { key: string }) => useLocalStorage<string>(key, ''),
      { initialProps: { key: 'tab-0' } },
    );

    expect(result.current[0]).toBe('A');

    rerender({ key: 'tab-5' });

    expect(result.current[0]).toBe('B');
  });

  it('does NOT overwrite another key when the key prop changes (regression)', () => {
    // Reproduces the Alt+number tab switch bug:
    // 旧実装では key 変更時に save effect が前 key の value を新 key に書き込んでしまった。
    localStorage.setItem('simple-memo-tab-0', JSON.stringify('A'));
    localStorage.setItem('simple-memo-tab-5', JSON.stringify('B'));

    const { rerender } = renderHook(
      ({ key }: { key: string }) => useLocalStorage<string>(key, ''),
      { initialProps: { key: 'tab-0' } },
    );

    rerender({ key: 'tab-5' });

    expect(localStorage.getItem('simple-memo-tab-5')).toBe(JSON.stringify('B'));
    expect(localStorage.getItem('simple-memo-tab-0')).toBe(JSON.stringify('A'));
  });

  it('writes to the correct key after switching and typing', () => {
    localStorage.setItem('simple-memo-tab-0', JSON.stringify('A'));
    localStorage.setItem('simple-memo-tab-5', JSON.stringify('B'));

    const { result, rerender } = renderHook(
      ({ key }: { key: string }) => useLocalStorage<string>(key, ''),
      { initialProps: { key: 'tab-0' } },
    );

    rerender({ key: 'tab-5' });

    act(() => {
      result.current[1]('BX');
    });

    expect(result.current[0]).toBe('BX');
    expect(localStorage.getItem('simple-memo-tab-5')).toBe(JSON.stringify('BX'));
    expect(localStorage.getItem('simple-memo-tab-0')).toBe(JSON.stringify('A'));
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
