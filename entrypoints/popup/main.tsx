import React from 'react';
import ReactDOM from 'react-dom/client';
import PopupApp from '@/components/layouts/PopupApp';
import { ensureMigrated } from '@/lib/migrate';
import '@/assets/global.css';

ensureMigrated().finally(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <PopupApp />
    </React.StrictMode>,
  );
});
