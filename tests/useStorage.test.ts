import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useStorage } from '@/hooks/useStorage';

type Listener<T> = (newValue: T, oldValue: T) => void;

/**
 * `storage.defineItem` の最小限のモック。
 * - `getValue` は内部キャッシュを Promise で返す
 * - `setValue` はキャッシュ更新 + 登録済み listener へ通知
 * - `watch` は購読を返し、戻り値で解除可能
 */
function fakeItem<T>(initial: T) {
  let cached = initial;
  const listeners = new Set<Listener<T>>();
  return {
    fallback: initial,
    getValue: vi.fn(() => Promise.resolve(cached)),
    setValue: vi.fn((next: T) => {
      const prev = cached;
      cached = next;
      for (const cb of listeners) cb(next, prev);
      return Promise.resolve();
    }),
    watch: vi.fn((cb: Listener<T>) => {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    }),
  };
}

describe('useStorage', () => {
  it('返却値の初期表示は item.fallback', () => {
    const item = fakeItem<string>('init');
    const { result } = renderHook(() => useStorage(item));
    expect(result.current[0]).toBe('init');
  });

  it('マウント後に getValue の結果で更新される', async () => {
    const item = fakeItem<string>('init');
    item.getValue.mockResolvedValueOnce('loaded');
    const { result } = renderHook(() => useStorage(item));
    await waitFor(() => expect(result.current[0]).toBe('loaded'));
  });

  it('setter は state と storage を同期更新する', async () => {
    const item = fakeItem<string>('init');
    const { result } = renderHook(() => useStorage(item));
    await waitFor(() => expect(item.getValue).toHaveBeenCalled());

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(item.setValue).toHaveBeenCalledWith('updated');
  });

  it('外部 (別 context) からの watch 通知を反映する', async () => {
    const item = fakeItem<string>('init');
    const { result } = renderHook(() => useStorage(item));
    await waitFor(() => expect(item.watch).toHaveBeenCalled());

    // 別 context が storage を書き換えた状況をシミュレート
    act(() => {
      void item.setValue('from-other-context');
    });

    await waitFor(() => expect(result.current[0]).toBe('from-other-context'));
  });

  it('item が切り替わったら fallback を即時表示し、新 item の値で更新する', async () => {
    const a = fakeItem<string>('a-init');
    const b = fakeItem<string>('b-init');
    b.getValue.mockResolvedValueOnce('b-loaded');

    const { result, rerender } = renderHook(({ item }) => useStorage(item), {
      initialProps: { item: a },
    });
    await waitFor(() => expect(result.current[0]).toBe('a-init'));

    rerender({ item: b });

    // 切替直後は b.fallback が同期的に表示されるべき
    expect(result.current[0]).toBe('b-init');

    await waitFor(() => expect(result.current[0]).toBe('b-loaded'));
  });

  it('item が切り替わったら旧 item の watch を解除する', async () => {
    const a = fakeItem<string>('a');
    const b = fakeItem<string>('b');

    const unwatchA = vi.fn();
    a.watch.mockReturnValueOnce(unwatchA);

    const { rerender } = renderHook(({ item }) => useStorage(item), {
      initialProps: { item: a },
    });
    await waitFor(() => expect(a.watch).toHaveBeenCalled());

    rerender({ item: b });

    expect(unwatchA).toHaveBeenCalled();
  });
});
