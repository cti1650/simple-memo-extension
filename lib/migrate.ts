import { storage } from '#imports';
import { activeTabItem, memoItems, TAB_COUNT, titleItems } from './storage';

const MIGRATION_VERSION = 1;
const MIGRATION_KEY = 'local:_migration_version';

type MigrationWrite =
  | { item: (typeof titleItems)[number]; value: string }
  | { item: (typeof memoItems)[number]; value: string }
  | { item: typeof activeTabItem; value: number }
  | { key: typeof MIGRATION_KEY; value: number };

/**
 * 旧バージョン (localStorage 直書き) からのデータ移行。
 *
 * 安全性に関する設計:
 * - `storage.setItems` を1度だけ呼ぶことで、移行データとフラグを
 *   browser.storage.local.set の単一トランザクションでコミットする。
 *   途中失敗（フラグ未セット）でリトライ時にユーザー編集を上書きする
 *   リスクを排除している。
 * - 元の localStorage は削除しない（ロールバック用に残す）。
 *
 * 将来別バージョン (v2 以降) のスキーマ変更が必要になった場合は
 * MIGRATION_VERSION を上げ、現バージョンとの差分のみを別途処理する。
 */
async function migrate(): Promise<void> {
  const current = (await storage.getItem<number>(MIGRATION_KEY)) ?? 0;
  if (current >= MIGRATION_VERSION) return;

  const writes: MigrationWrite[] = [];

  for (let i = 0; i < TAB_COUNT; i++) {
    const title = readLegacyValue<string>(`simple-memo-title_${i}`);
    if (typeof title === 'string' && title.length > 0) {
      writes.push({ item: titleItems[i], value: title });
    }

    const memo = readLegacyValue<string>(`simple-memo-${i}`);
    if (typeof memo === 'string' && memo.length > 0) {
      writes.push({ item: memoItems[i], value: memo });
    }
  }

  const activeTab = readLegacyValue<number>('simple-memo-tabPage');
  if (typeof activeTab === 'number' && Number.isFinite(activeTab)) {
    // 範囲外・小数を許容しないようサニタイズ
    const clamped = Math.max(0, Math.min(TAB_COUNT - 1, Math.trunc(activeTab)));
    writes.push({ item: activeTabItem, value: clamped });
  }

  // フラグはデータと同じ setItems 呼び出しに含める（atomicity の要）
  writes.push({ key: MIGRATION_KEY, value: MIGRATION_VERSION });

  await storage.setItems(writes);
}

function readLegacyValue<T>(key: string): T | undefined {
  // service worker など localStorage を持たない context での import に備える
  if (typeof localStorage === 'undefined') return undefined;
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
 * 失敗は console.error にログするが render は継続させる。
 */
export function ensureMigrated(): Promise<void> {
  if (!migrationPromise) {
    migrationPromise = migrate().catch((error) => {
      console.error('[simple-memo] storage migration failed:', error);
    });
  }
  return migrationPromise;
}
