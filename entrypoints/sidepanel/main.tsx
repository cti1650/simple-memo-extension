import React from 'react';
import ReactDOM from 'react-dom/client';
import SidepanelApp from '@/components/layouts/SidepanelApp';
import { ensureMigrated } from '@/lib/migrate';
import '@/assets/global.css';

ensureMigrated().finally(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <SidepanelApp />
    </React.StrictMode>,
  );
});
