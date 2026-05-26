import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fakeBrowser } from 'wxt/testing';
import { storage } from '#imports';
import { useActiveTab } from '@/hooks/useActiveTab';

beforeEach(() => {
  fakeBrowser.reset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useActiveTab', () => {
  it('storage の値を返す', async () => {
    await storage.setItem('local:active_tab', 5);
    const { result } = renderHook(() => useActiveTab());
    await waitFor(() => expect(result.current.active).toBe(5));
  });

  it('storage に範囲外の値が入っていても 0..9 にクランプして返す', async () => {
    await storage.setItem('local:active_tab', 99);
    const { result } = renderHook(() => useActiveTab());
    await waitFor(() => expect(result.current.active).toBe(9));
  });

  it('storage に負値が入っていても 0 を返す', async () => {
    await storage.setItem('local:active_tab', -3);
    const { result } = renderHook(() => useActiveTab());
    await waitFor(() => expect(result.current.active).toBe(0));
  });

  it('storage に NaN/null が入っていても 0 を返す', async () => {
    await storage.setItem('local:active_tab', Number.NaN);
    const { result } = renderHook(() => useActiveTab());
    await waitFor(() => expect(result.current.active).toBe(0));
  });

  it('setActive は範囲外でもクランプして storage に保存する', async () => {
    const { result } = renderHook(() => useActiveTab());
    await waitFor(() => expect(result.current.active).toBe(0));

    act(() => {
      result.current.setActive(42);
    });

    await waitFor(() => expect(result.current.active).toBe(9));
    expect(await storage.getItem<number>('local:active_tab')).toBe(9);
  });

  it('小数や Infinity も整数にトリミングしてクランプする', async () => {
    const { result } = renderHook(() => useActiveTab());
    await waitFor(() => expect(result.current.active).toBe(0));

    act(() => {
      result.current.setActive(3.7);
    });
    await waitFor(() => expect(result.current.active).toBe(3));

    act(() => {
      result.current.setActive(Number.POSITIVE_INFINITY);
    });
    await waitFor(() => expect(result.current.active).toBe(9));
  });
});
