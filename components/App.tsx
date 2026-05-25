import { useCallback, useState } from 'react';
import { Header } from './Layout/Header';
import { Textbox } from './Textbox/Textbox';
import { PageTabs } from './tabs/Tabs';

const PAGE_COUNT = 10;

export default function App() {
  const [tabPage, setTabPage] = useState(0);
  const handleChange = useCallback((index: number) => {
    setTabPage(index);
  }, []);

  return (
    <div className="py-1 px-2 min-popup-size w-full h-full border border-gray-200">
      <Header />
      <PageTabs onChange={handleChange} onInit={handleChange} pageCount={PAGE_COUNT} />
      <div className="w-full h-full">
        <div className="w-full h-full">
          {Array.from({ length: PAGE_COUNT }, (_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: i is the stable tab identifier
            <Textbox key={i} saveKey={i} openKey={tabPage} />
          ))}
        </div>
      </div>
    </div>
  );
}
