type SidePanelApi = {
  open(options: { windowId?: number; tabId?: number }): Promise<void>;
};

const sidePanel = (browser as unknown as { sidePanel: SidePanelApi }).sidePanel;

export default defineBackground(() => {
  const openSidePanel = async (windowId: number | undefined) => {
    if (windowId == null) return;
    await sidePanel.open({ windowId });
  };

  browser.runtime.onInstalled.addListener(() => {
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
  });

  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === 'open-sidepanel') {
      await openSidePanel(tab?.windowId);
    } else if (info.menuItemId === 'open-options') {
      await browser.runtime.openOptionsPage();
    }
  });

  browser.commands.onCommand.addListener(async (command) => {
    if (command === 'open-sidepanel') {
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
      await openSidePanel(tab?.windowId);
    } else if (command === 'open-options') {
      await browser.runtime.openOptionsPage();
    }
  });
});
