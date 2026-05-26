import { Header } from '@/components/Header';
import { MemoEditor } from '@/components/MemoEditor';
import { TabList } from '@/components/tabs/TabList';
import { TAB_COUNT, useActiveTab } from '@/hooks/useActiveTab';
import { useNumberShortcut } from '@/hooks/useNumberShortcut';

export default function OptionsApp() {
  const { active, setActive } = useActiveTab();
  useNumberShortcut(setActive);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="px-4 py-3 border-b border-gray-200 bg-white">
        <Header />
      </header>
      <div className="flex-1 min-h-0 flex flex-row">
        <aside className="w-72 shrink-0 border-r border-gray-200 bg-white overflow-y-auto">
          <TabList active={active} count={TAB_COUNT} onSelect={setActive} />
          <p className="px-4 pb-4 text-xs text-gray-500 select-none">Alt + 0〜9 でタブ切替</p>
        </aside>
        <main className="flex-1 min-w-0 min-h-0 p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto h-full">
            <MemoEditor index={active} fill />
          </div>
        </main>
      </div>
    </div>
  );
}
