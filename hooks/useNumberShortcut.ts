import { useEffect } from 'react';

/**
 * Alt + 0..9 をタブ切替に割り当てる。
 * macOS では Alt + 数字が特殊文字 (º¡™£¢∞§¶•ª) として e.key に入るため、
 * 物理キー位置を表す e.code (Digit0..Digit9 / Numpad0..Numpad9) で判定する。
 */
export function useNumberShortcut(setActive: (index: number) => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const match = e.code.match(/^(?:Digit|Numpad)(\d)$/);
      if (!match) return;
      e.preventDefault();
      setActive(Number(match[1]));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setActive]);
}
