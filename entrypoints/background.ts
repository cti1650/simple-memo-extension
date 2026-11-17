import { type ActionBehavior, actionBehaviorItem } from '@/lib/storage';

export default defineBackground(() => {
  // WXT はビルド時に entrypoint を Node で import するため、ランタイム API への
  // アクセスは main 関数内に置く。
  // Firefox (MV2) には sidePanel / action が無いので undefined を許容し、
  // action は MV2 の browserAction にフォールバックする。
  const sidePanel = browser.sidePanel as typeof browser.sidePanel | undefined;
  const action = browser.action ?? browser.browserAction;
  const actionMenuContext = import.meta.env.MANIFEST_VERSION === 2 ? 'browser_action' : 'action';

  const openSidePanel = async (windowId: number | undefined) => {
    if (windowId == null) return;
    try {
      await sidePanel?.open({ windowId });
    } catch (error) {
      console.error('[simple-memo] sidePanel.open failed:', error);
    }
  };

  /**
   * options ページを新規タブで開く。既にどこかのウィンドウで開いていれば、
   * そのタブとウィンドウを前面に出して再利用する。
   * tabs 権限なしで既存タブを探すため runtime.getContexts を使い、
   * 非対応環境 (Firefox 等) では openOptionsPage にフォールバックする。
   */
  const openOptions = async () => {
    const optionsUrl = browser.runtime.getURL('/options.html');
    try {
      if (typeof browser.runtime.getContexts !== 'function') {
        await browser.runtime.openOptionsPage();
        return;
      }
      const [existing] = await browser.runtime.getContexts({
        contextTypes: ['TAB' as Browser.runtime.ContextType],
        documentUrls: [optionsUrl],
      });
      if (existing && existing.tabId !== -1) {
        await browser.tabs.update(existing.tabId, { active: true });
        if (existing.windowId !== -1) {
          await browser.windows.update(existing.windowId, { focused: true });
        }
        return;
      }
      await browser.tabs.create({ url: optionsUrl, active: true });
    } catch (error) {
      console.error('[simple-memo] openOptions failed:', error);
    }
  };

  // manifest に書かれた popup パス（WXT が popup entrypoint から自動設定）
  const manifest = browser.runtime.getManifest();
  const defaultPopup = (manifest.action ?? manifest.browser_action)?.default_popup ?? '';
  let currentBehavior: ActionBehavior = 'popup';

  /**
   * アクションボタンのクリック挙動を切り替える。
   * - popup: manifest の default_popup を復元
   * - sidepanel: popup を外し、setPanelBehavior でクリック時に side panel を開く
   * - options: popup を外し、action.onClicked で options ページを開く
   * action.setPopup はブラウザ再起動で manifest 値に戻るため、background 起動毎に適用する。
   */
  const applyActionBehavior = async (behavior: ActionBehavior) => {
    currentBehavior = behavior;
    try {
      await action.setPopup({ popup: behavior === 'popup' ? defaultPopup : '' });
      await sidePanel?.setPanelBehavior?.({ openPanelOnActionClick: behavior === 'sidepanel' });
    } catch (error) {
      console.error('[simple-memo] applyActionBehavior failed:', error);
    }
  };

  void actionBehaviorItem.getValue().then(applyActionBehavior);
  actionBehaviorItem.watch((next) => void applyActionBehavior(next));

  // popup を外したときだけ発火する。sidepanel は setPanelBehavior が処理するが、
  // 非対応環境向けにフォールバックとして明示的に開く
  action.onClicked.addListener((tab) => {
    if (currentBehavior === 'options') {
      void openOptions();
    } else if (currentBehavior === 'sidepanel' && !sidePanel?.setPanelBehavior) {
      void openSidePanel(tab.windowId);
    }
  });

  // 更新時に既存の context menu が残っていると create が "duplicate id" で
  // 失敗するため、毎回 removeAll してから作り直す
  browser.runtime.onInstalled.addListener(async () => {
    try {
      await browser.contextMenus.removeAll();
      browser.contextMenus.create({
        id: 'open-sidepanel',
        title: 'Simple Memo を side panel で開く',
        contexts: [actionMenuContext, 'page'],
      });
      browser.contextMenus.create({
        id: 'open-options',
        title: 'Simple Memo を options ページで開く',
        contexts: [actionMenuContext, 'page'],
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
