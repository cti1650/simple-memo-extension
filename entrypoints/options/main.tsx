import React from 'react';
import ReactDOM from 'react-dom/client';
import OptionsApp from '@/components/layouts/OptionsApp';
import { ensureMigrated } from '@/lib/migrate';
import '@/assets/global.css';

ensureMigrated().finally(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <OptionsApp />
    </React.StrictMode>,
  );
});
