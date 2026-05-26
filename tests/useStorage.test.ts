import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useStorage } from '@/hooks/useStorage';

type Listener<T> = (newValue: T, oldValue: T) => void;

/**
 * `storage.defineItem` の最小限のモック (setValue で同期的に watch が発火)。
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

/**
 * `setValue` から watch 発火までを遅延キューに溜める fake。
 * テストから `flushNext` / `flushAll` で commit タイミングを制御する。
 */
function deferredFakeItem<T>(initial: T) {
  let cached = initial;
  const listeners = new Set<Listener<T>>();
  const queue: Array<() => void> = [];
  return {
    fallback: initial,
    getValue: vi.fn(() => Promise.resolve(cached)),
    setValue: vi.fn((next: T) => {
      queue.push(() => {
        const prev = cached;
        cached = next;
        for (const cb of listeners) cb(next, prev);
      });
      return Promise.resolve();
    }),
    watch: vi.fn((cb: Listener<T>) => {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    }),
    flushNext: () => queue.shift()?.(),
    flushAll: () => {
      while (queue.length > 0) queue.shift()?.();
    },
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

  it('連続入力中に遅延 watch エコーが届いても state が巻き戻らない', async () => {
    const item = deferredFakeItem<string>('');
    const { result } = renderHook(() => useStorage(item));
    await waitFor(() => expect(item.getValue).toHaveBeenCalled());

    // バースト入力: 'A' → 'AB' を連続で送る (commit はまだ走らない)
    act(() => {
      result.current[1]('A');
      result.current[1]('AB');
    });
    expect(result.current[0]).toBe('AB');

    // 古い 'A' の commit が watch を遅延発火
    act(() => {
      item.flushNext();
    });
    // 自エコー判定で state は巻き戻らない
    expect(result.current[0]).toBe('AB');

    // 続く 'AB' の commit も自エコー
    act(() => {
      item.flushNext();
    });
    expect(result.current[0]).toBe('AB');
  });

  it('別 context からの予期せぬ値は受け入れる (pending があっても)', async () => {
    const item = deferredFakeItem<string>('');
    const { result } = renderHook(() => useStorage(item));
    await waitFor(() => expect(item.getValue).toHaveBeenCalled());

    act(() => {
      result.current[1]('A');
    });
    expect(result.current[0]).toBe('A');

    // 別 context が別の値で割り込んできた状況 (watch を直接叩く)
    const watchCb = item.watch.mock.calls[0][0] as Listener<string>;
    act(() => {
      watchCb('外部値', '');
    });

    expect(result.current[0]).toBe('外部値');
  });
});
