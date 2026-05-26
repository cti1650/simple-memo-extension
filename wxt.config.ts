import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react', '@wxt-dev/auto-icons'],
  manifest: {
    name: 'Simple Memo Extension',
    description: 'Simple Memo Extension',
    permissions: ['contextMenus', 'sidePanel', 'storage'],
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
    // icons は @wxt-dev/auto-icons が assets/icon.png から自動生成する
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
