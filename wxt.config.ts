import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Simple Memo Extension',
    description: 'Simple Memo Extension',
    permissions: ['contextMenus', 'sidePanel'],
    action: {
      default_title: 'Simple Memo Extension',
    },
    side_panel: {
      default_path: 'sidepanel.html',
    },
    commands: {
      'open-sidepanel': {
        suggested_key: {
          default: 'Alt+Shift+M',
          mac: 'Alt+Shift+M',
        },
        description: 'Simple Memo を side panel で開く',
      },
      'open-options': {
        suggested_key: {
          default: 'Alt+Shift+O',
          mac: 'Alt+Shift+O',
        },
        description: 'Simple Memo を options ページで開く',
      },
    },
    icons: {
      16: 'icons/icon-16x16.png',
      48: 'icons/icon-48x48.png',
      128: 'icons/icon-128x128.png',
    },
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
