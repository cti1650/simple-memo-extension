type SidePanelApi = {
  open(options: { windowId?: number; tabId?: number }): Promise<void>;
};

const sidePanel = (browser as unknown as { sidePanel: SidePanelApi }).sidePanel;

export default defineBackground(() => {
  const openSidePanel = async (windowId: number | undefined) => {
    if (windowId == null) return;
    try {
      await sidePanel.open({ windowId });
    } catch (error) {
      console.error('[simple-memo] sidePanel.open failed:', error);
    }
  };

  const openOptions = async () => {
    try {
      await browser.runtime.openOptionsPage();
    } catch (error) {
      console.error('[simple-memo] openOptionsPage failed:', error);
    }
  };

  // 更新時に既存の context menu が残っていると create が "duplicate id" で
  // 失敗するため、毎回 removeAll してから作り直す
  browser.runtime.onInstalled.addListener(async () => {
    try {
      await browser.contextMenus.removeAll();
      browser.contextMenus.create({
        id: 'open-sidepanel',
        title: 'Simple Memo を side panel で開く',
        contexts: ['action', 'page'],
      });
      browser.contextMenus.create({
        id: 'open-options',
        title: 'Simple Memo を options ページで開く',
        contexts: ['action', 'page'],
      });
    } catch (error) {
      console.error('[simple-memo] context menu setup failed:', error);
    }
  });

  browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'open-sidepanel') {
      void openSidePanel(tab?.windowId);
    } else if (info.menuItemId === 'open-options') {
      void openOptions();
    }
  });

  browser.commands.onCommand.addListener(async (command) => {
    if (command === 'open-sidepanel') {
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
      void openSidePanel(tab?.windowId);
    } else if (command === 'open-options') {
      void openOptions();
    }
  });
});
