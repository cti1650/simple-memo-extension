import { Header } from '@/components/Header';
import { MemoEditor } from '@/components/MemoEditor';
import { TabBar } from '@/components/tabs/TabBar';
import { TAB_COUNT, useActiveTab } from '@/hooks/useActiveTab';
import { useNumberShortcut } from '@/hooks/useNumberShortcut';

export default function PopupApp() {
  const { active, setActive } = useActiveTab();
  useNumberShortcut(setActive);

  return (
    <div className="popup-size flex flex-col gap-2 py-1 px-2 border border-gray-200 bg-gray-50 overflow-hidden">
      <Header />
      <TabBar active={active} count={TAB_COUNT} onSelect={setActive} />
      <div className="flex-1 min-h-0">
        <MemoEditor index={active} fill />
      </div>
    </div>
  );
}
