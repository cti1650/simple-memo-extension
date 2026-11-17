import cc from 'classcat';
import { useStorage } from '@/hooks/useStorage';
import { ACTION_BEHAVIORS, type ActionBehavior, actionBehaviorItem } from '@/lib/storage';

const LABELS: Record<ActionBehavior, string> = {
  popup: 'ポップアップ',
  sidepanel: 'サイドパネル',
  options: 'オプションページ',
};

type Props = {
  className?: string;
};

/** アクションボタンクリック時の表示面を切り替える控えめなセレクタ */
export const ActionBehaviorSelect = ({ className }: Props) => {
  const [behavior, setBehavior] = useStorage(actionBehaviorItem);

  return (
    <label
      className={cc(['flex items-center gap-1 text-[11px] text-gray-400 select-none', className])}
    >
      アイコンクリック時:
      <select
        value={behavior}
        onChange={(e) => setBehavior(e.target.value as ActionBehavior)}
        className="bg-transparent text-gray-500 hover:text-gray-700 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-400 rounded"
      >
        {ACTION_BEHAVIORS.map((value) => (
          <option key={value} value={value}>
            {LABELS[value]}
          </option>
        ))}
      </select>
    </label>
  );
};
