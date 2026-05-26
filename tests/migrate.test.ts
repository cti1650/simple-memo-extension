import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fakeBrowser } from 'wxt/testing';
import { storage } from '#imports';

beforeEach(() => {
  fakeBrowser.reset();
  localStorage.clear();
  // ensureMigrated 内の module-level promise をリセットするため、毎回新規 import
  vi.resetModules();
});

afterEach(() => {
  vi.restoreAllMocks();
});

async function importMigrate() {
  return await import('@/lib/migrate');
}

describe('ensureMigrated', () => {
  it('localStorage の値を chrome.storage に移行する', async () => {
    localStorage.setItem('simple-memo-title_0', JSON.stringify('タイトル'));
    localStorage.setItem('simple-memo-0', JSON.stringify('メモ本文'));
    localStorage.setItem('simple-memo-tabPage', JSON.stringify(3));

    const { ensureMigrated } = await importMigrate();
    await ensureMigrated();

    expect(await storage.getItem<string>('local:title_0')).toBe('タイトル');
    expect(await storage.getItem<string>('local:memo_0')).toBe('メモ本文');
    expect(await storage.getItem<number>('local:active_tab')).toBe(3);
    expect(await storage.getItem<number>('local:_migration_version')).toBe(1);
  });

  it('既に最新バージョンならスキップする', async () => {
    await storage.setItem('local:_migration_version', 1);
    localStorage.setItem('simple-memo-title_0', JSON.stringify('旧データ'));

    const { ensureMigrated } = await importMigrate();
    await ensureMigrated();

    // 旧データで上書きされていないこと
    expect(await storage.getItem<string>('local:title_0')).toBeNull();
  });

  it('atomic 書き込み: setItems が1回だけ呼ばれる (途中失敗による部分移行を防ぐ)', async () => {
    localStorage.setItem('simple-memo-title_0', JSON.stringify('A'));
    localStorage.setItem('simple-memo-title_1', JSON.stringify('B'));
    localStorage.setItem('simple-memo-0', JSON.stringify('aa'));
    localStorage.setItem('simple-memo-tabPage', JSON.stringify(2));

    const setItemsSpy = vi.spyOn(storage, 'setItems');

    const { ensureMigrated } = await importMigrate();
    await ensureMigrated();

    expect(setItemsSpy).toHaveBeenCalledTimes(1);
    // タイトル2件 + メモ1件 + active_tab + フラグ = 5
    expect(setItemsSpy.mock.calls[0][0]).toHaveLength(5);
  });

  it('空文字・空白は書き込まずスキップする', async () => {
    localStorage.setItem('simple-memo-title_0', JSON.stringify(''));
    localStorage.setItem('simple-memo-0', JSON.stringify('実データ'));

    const { ensureMigrated } = await importMigrate();
    await ensureMigrated();

    // 空 title は書き込まれないので fallback ('') のまま
    expect(await storage.getItem<string>('local:title_0')).toBeNull();
    expect(await storage.getItem<string>('local:memo_0')).toBe('実データ');
  });

  it('範囲外の active_tab を 0〜9 にクランプする', async () => {
    localStorage.setItem('simple-memo-tabPage', JSON.stringify(99));

    const { ensureMigrated } = await importMigrate();
    await ensureMigrated();

    expect(await storage.getItem<number>('local:active_tab')).toBe(9);
  });

  it('NaN/Infinity の active_tab は無視する', async () => {
    localStorage.setItem('simple-memo-tabPage', JSON.stringify(null));

    const { ensureMigrated } = await importMigrate();
    await ensureMigrated();

    // 不正値は書き込まれない（フラグは立つ）
    expect(await storage.getItem<number>('local:active_tab')).toBeNull();
    expect(await storage.getItem<number>('local:_migration_version')).toBe(1);
  });

  it('壊れた JSON が混ざっていても他のキーは移行される', async () => {
    localStorage.setItem('simple-memo-title_0', '{壊れたJSON');
    localStorage.setItem('simple-memo-title_1', JSON.stringify('正常データ'));

    const { ensureMigrated } = await importMigrate();
    await ensureMigrated();

    expect(await storage.getItem<string>('local:title_0')).toBeNull();
    expect(await storage.getItem<string>('local:title_1')).toBe('正常データ');
  });

  it('localStorage が空でもフラグだけは立つ (次回起動でスキップさせる)', async () => {
    const { ensureMigrated } = await importMigrate();
    await ensureMigrated();

    expect(await storage.getItem<number>('local:_migration_version')).toBe(1);
  });

  it('同一 context での連続呼び出しは1回しか実行されない', async () => {
    localStorage.setItem('simple-memo-title_0', JSON.stringify('A'));
    const setItemsSpy = vi.spyOn(storage, 'setItems');

    const { ensureMigrated } = await importMigrate();
    await Promise.all([ensureMigrated(), ensureMigrated(), ensureMigrated()]);

    expect(setItemsSpy).toHaveBeenCalledTimes(1);
  });

  it('setItems が失敗してもフラグは立たず、エラーで render は止めない', async () => {
    localStorage.setItem('simple-memo-title_0', JSON.stringify('A'));
    vi.spyOn(storage, 'setItems').mockRejectedValueOnce(new Error('quota'));
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const { ensureMigrated } = await importMigrate();
    await expect(ensureMigrated()).resolves.toBeUndefined();

    // フラグは立たない → 次回起動でリトライされる
    expect(await storage.getItem<number>('local:_migration_version')).toBeNull();
  });
});
