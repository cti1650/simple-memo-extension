import { storage } from '#imports';
import { activeTabItem, memoItems, TAB_COUNT, titleItems } from './storage';

const MIGRATION_VERSION = 1;
const MIGRATION_KEY = 'local:_migration_version';

/**
 * 旧バージョン (localStorage 直書き) からのデータ移行。
 *
 * - chrome.storage 側に最新バージョンのフラグが立っていたら何もしない
 * - localStorage に値があればコピー、なければ初期値のまま
 * - 元の localStorage は削除しない（ロールバック用に残す）
 */
async function migrate(): Promise<void> {
  const current = (await storage.getItem<number>(MIGRATION_KEY)) ?? 0;
  if (current >= MIGRATION_VERSION) return;

  for (let i = 0; i < TAB_COUNT; i++) {
    const title = readLegacyValue<string>(`simple-memo-title_${i}`);
    if (title) await titleItems[i].setValue(title);

    const memo = readLegacyValue<string>(`simple-memo-${i}`);
    if (memo) await memoItems[i].setValue(memo);
  }

  const activeTab = readLegacyValue<number>('simple-memo-tabPage');
  if (typeof activeTab === 'number') await activeTabItem.setValue(activeTab);

  await storage.setItem(MIGRATION_KEY, MIGRATION_VERSION);
}

function readLegacyValue<T>(key: string): T | undefined {
  const raw = localStorage.getItem(key);
  if (raw === null) return undefined;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

let migrationPromise: Promise<void> | null = null;

/**
 * 各 entrypoint から render 前に呼び出す。複数回呼んでも1回しか走らない。
 */
export function ensureMigrated(): Promise<void> {
  if (!migrationPromise) {
    migrationPromise = migrate().catch((error) => {
      console.error('[simple-memo] storage migration failed:', error);
    });
  }
  return migrationPromise;
}
