import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useNumberShortcut } from '@/hooks/useNumberShortcut';

const fire = (init: KeyboardEventInit) => {
  window.dispatchEvent(new KeyboardEvent('keydown', init));
};

describe('useNumberShortcut', () => {
  it('Alt + 数字キーで対応する index を渡す', () => {
    const setActive = vi.fn();
    renderHook(() => useNumberShortcut(setActive));

    fire({ altKey: true, code: 'Digit5', key: '5' });

    expect(setActive).toHaveBeenCalledWith(5);
  });

  it('macOS で Alt + 数字が特殊文字になっても e.code で拾える', () => {
    const setActive = vi.fn();
    renderHook(() => useNumberShortcut(setActive));

    // Alt + 3 が macOS では '£' になるが、e.code は Digit3
    fire({ altKey: true, code: 'Digit3', key: '£' });

    expect(setActive).toHaveBeenCalledWith(3);
  });

  it('Numpad の数字キーにも対応する', () => {
    const setActive = vi.fn();
    renderHook(() => useNumberShortcut(setActive));

    fire({ altKey: true, code: 'Numpad7', key: '7' });

    expect(setActive).toHaveBeenCalledWith(7);
  });

  it('Alt が押されていない場合は何もしない', () => {
    const setActive = vi.fn();
    renderHook(() => useNumberShortcut(setActive));

    fire({ code: 'Digit5', key: '5' });

    expect(setActive).not.toHaveBeenCalled();
  });

  it('Alt + 他のキーは無視する', () => {
    const setActive = vi.fn();
    renderHook(() => useNumberShortcut(setActive));

    fire({ altKey: true, code: 'KeyA', key: 'a' });

    expect(setActive).not.toHaveBeenCalled();
  });

  it('Ctrl/Meta/Shift と併用された場合は無視する', () => {
    const setActive = vi.fn();
    renderHook(() => useNumberShortcut(setActive));

    fire({ altKey: true, ctrlKey: true, code: 'Digit5', key: '5' });
    fire({ altKey: true, metaKey: true, code: 'Digit5', key: '5' });
    fire({ altKey: true, shiftKey: true, code: 'Digit5', key: '5' });

    expect(setActive).not.toHaveBeenCalled();
  });
});
