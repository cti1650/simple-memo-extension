import { Header } from '@/components/Header';
import { MemoEditor } from '@/components/MemoEditor';
import { TabBar } from '@/components/tabs/TabBar';
import { TAB_COUNT, useActiveTab } from '@/hooks/useActiveTab';
import { useNumberShortcut } from '@/hooks/useNumberShortcut';

export default function SidepanelApp() {
  const { active, setActive } = useActiveTab();
  useNumberShortcut(setActive);

  return (
    <div className="h-screen flex flex-col gap-2 py-2 px-3 bg-gray-50">
      <Header />
      <TabBar active={active} count={TAB_COUNT} onSelect={setActive} />
      <div className="flex-1 min-h-0">
        <MemoEditor index={active} fill />
      </div>
    </div>
  );
}
