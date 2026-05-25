# Simple Memo Extension

10タブ分のメモを **Popup / Side panel / Options** の3面から編集・保存できるシンプルなメモ拡張機能です。データはブラウザの `localStorage` に保存されます。

## 使い方

| 表示面 | 開き方 | 用途 |
| --- | --- | --- |
| **Popup** | ツールバーのアイコンクリック | サッと書く・読む |
| **Side panel** | アイコン上 or ページ上の右クリック → 「Simple Memo を side panel で開く」 / `Alt+Shift+M` | ブラウジング中に常時表示 |
| **Options** | アイコン上 or ページ上の右クリック → 「Simple Memo を options ページで開く」 / `Alt+Shift+O` / 拡張機能管理画面の「オプション」 | 一覧から選んでじっくり編集 |

### 共通操作

- `Alt+0` 〜 `Alt+9` … タブを直接切り替え
- タブ右上の青いドット … その番号にデータあり
- Title / Memo 欄は入力即時保存（localStorage）

## 技術スタック

- [WXT](https://wxt.dev/) (Manifest V3)
- React 19 + TypeScript
- Tailwind CSS v4
- パッケージ管理: **pnpm**
- Lint / Format: **Biome**
- Test: **Vitest** + Testing Library (jsdom)
- Git hooks: **Lefthook**

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
  background.ts   # 右クリックメニュー / Alt+Shift+M ハンドラ
components/
  layouts/        # PopupApp / SidepanelApp / OptionsApp
  tabs/           # TabBar (horizontal) / TabList (vertical)
  MemoEditor.tsx  # Title + Memo + 文字数
  Layout/Header.tsx
hooks/            # useLocalStorage / useActiveTab / useNumberShortcut
assets/           # グローバル CSS (Tailwind)
public/icons/
tests/            # Vitest テスト
wxt.config.ts     # WXT / manifest 設定
biome.json
vitest.config.ts
lefthook.yml
```

## バージョン更新

`package.json` の `version` を更新してから `pnpm build` してください（WXT が自動で `manifest.json` に反映します）。
