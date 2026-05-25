# Simple Memo Extension

10タブ分のメモを Chrome 拡張機能のポップアップ / オプションページから編集・保存できるシンプルなメモ拡張機能です。データはブラウザの `localStorage` に保存されます。

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
entrypoints/    # WXT エントリポイント (popup / options)
components/     # React コンポーネント
hooks/          # カスタムフック
assets/         # グローバル CSS (Tailwind)
public/         # 静的アセット (アイコン)
tests/          # Vitest テスト
wxt.config.ts   # WXT / manifest 設定
biome.json      # Biome 設定
vitest.config.ts
lefthook.yml
```

## バージョン更新

`package.json` の `version` を更新してから `pnpm build` してください（WXT が自動で `manifest.json` に反映します）。
