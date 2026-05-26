# Simple Memo Extension

10タブ分のメモを **Popup / Side panel / Options** の3面から編集・保存できるシンプルなメモ拡張機能です。データは `chrome.storage.local` に保存され、3画面の間でライブ同期されます。

## 使い方

| 表示面 | 開き方 | 用途 |
| --- | --- | --- |
| **Popup** | ツールバーのアイコンクリック | サッと書く・読む |
| **Side panel** | アイコン上 or ページ上の右クリック → 「Simple Memo を side panel で開く」 / `Alt+Shift+M` | ブラウジング中に常時表示 |
| **Options** | アイコン上 or ページ上の右クリック → 「Simple Memo を options ページで開く」 / `Alt+Shift+O` / 拡張機能管理画面の「オプション」 | 一覧から選んでじっくり編集 |

### 共通操作

- `Alt+0` 〜 `Alt+9` … タブを直接切り替え
- 矢印キー (`←/→` または `↑/↓`)・`Home`・`End` … タブリスト内でフォーカス移動
- タブ右上の青いドット … その番号にデータあり
- Title / Memo 欄は入力即時保存（`chrome.storage.local`）
- popup / sidepanel / options を複数開いていても、片方の編集が即座に他方へ反映される

### ショートカットの変更

`Alt+Shift+M` / `Alt+Shift+O` が他の拡張機能や OS と競合する場合、
`chrome://extensions/shortcuts` から自由に再割当てできます。

### データの保存先・プライバシー

- すべてのメモは **`chrome.storage.local`** にのみ保存されます
- **外部送信・同期は一切行いません**（`chrome.storage.sync` も使いません）
- 拡張機能をアンインストールするとデータは削除されます
- DevTools (Application → Storage → Extension Storage → Local) から内容を直接確認できます

## 技術スタック

- [WXT](https://wxt.dev/) (Manifest V3) + `@wxt-dev/module-react` + `@wxt-dev/auto-icons`
- React 19 + TypeScript
- Tailwind CSS v4
- パッケージ管理: **pnpm**
- Lint / Format: **Biome**
- Test: **Vitest** + Testing Library (jsdom)
- Git hooks: **Lefthook**
- CI: GitHub Actions ([.github/workflows/ci.yml](.github/workflows/ci.yml))
- 依存関係更新: Dependabot ([.github/dependabot.yml](.github/dependabot.yml))

## セットアップ

```bash
pnpm install
```

`postinstall` で `wxt prepare` が、`prepare` で `lefthook install` が自動実行されます。

## 開発

```bash
pnpm dev          # Chrome を自動起動してホットリロード
pnpm dev:firefox  # Firefox
```

## ビルド・配布

```bash
pnpm build          # .output/chrome-mv3/ に成果物を生成
pnpm build:firefox  # Firefox 向け
pnpm zip            # ストア提出用 zip
```

`pnpm build` で生成された `.output/chrome-mv3/` を `chrome://extensions/` の「パッケージ化されていない拡張機能を読み込む」で読み込むと動作確認できます。

## 品質チェック

```bash
pnpm compile     # tsc --noEmit
pnpm lint        # Biome check
pnpm lint:fix    # Biome auto-fix
pnpm format      # Biome format only
pnpm test        # Vitest (run once)
pnpm test:watch  # Vitest watch mode
```

## Git Hooks (Lefthook)

| Hook | 実行内容 |
| --- | --- |
| `pre-commit` | staged ファイルに対して `biome check --write`（自動修正を再ステージ） |
| `pre-push`   | `pnpm compile` と `pnpm test` |

設定: [lefthook.yml](./lefthook.yml)

## ディレクトリ構成

```
entrypoints/
  popup/          # Popup (action click)
  sidepanel/      # Side panel
  options/        # Options page (open_in_tab)
  background.ts   # 右クリックメニュー / コマンドハンドラ
components/
  layouts/        # PopupApp / SidepanelApp / OptionsApp
  tabs/           # TabBar (horizontal) / TabList (vertical)
  Header.tsx
  MemoEditor.tsx  # Title + Memo + 文字数
hooks/
  useStorage.ts
  useActiveTab.ts
  useNumberShortcut.ts
  useTabKeyboardNav.ts
lib/
  storage.ts      # 全 storage アイテムの集約定義
  migrate.ts      # 旧 localStorage → chrome.storage への一回限り移行
assets/
  global.css      # Tailwind v4 エントリ
  icon.png        # @wxt-dev/auto-icons の源画像 (16/32/48/128 を自動生成)
tests/
.github/
  workflows/ci.yml
  dependabot.yml
wxt.config.ts
biome.json
vitest.config.ts
lefthook.yml
```

## バージョン更新

`package.json` の `version` を更新してから `pnpm build` してください（WXT が自動で `manifest.json` に反映します）。
