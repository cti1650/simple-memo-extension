import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Simple Memo Extension',
    description: 'Simple Memo Extension',
    permissions: [],
    action: {
      default_title: 'Simple Memo Extension',
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
