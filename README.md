# AI Scrum Lab

日本語 UI の最小スクラムボード。**このアプリ自体がプロダクトであり、スプリントを回すボードでもある。**

## ロール

| 役割 | 誰 |
|------|-----|
| Product Owner (PO) | ユーザー |
| Development (+ Scrum Master 支援) | Grok Bot / エージェント |

Sprint 2 Goal: **カードを列間でドラッグでき、各カードにポイントを付けられる**（＋合計表示）

## 使い方（起動）

```bash
npm install
npm run dev
```

ブラウザで表示される URL（通常 `http://localhost:5173`）を開く。

本番ビルド:

```bash
npm run build
npm run preview
```

データはブラウザの `localStorage` に保存される（リロードしても残る）。「データ初期化」でサンプル状態に戻せる。

## ファイルマップ

```
ai-scrum-lab/
├── index.html
├── package.json
├── docs/
│   ├── SPRINT1.md
│   └── SPRINT2.md             # Sprint 2 レビュー用メモ
├── public/
│   └── favicon.svg
└── src/
    ├── main.tsx
    ├── App.tsx                # 状態・DnD コンテキスト
    ├── App.css / index.css
    ├── types.ts
    ├── storage.ts
    ├── points.ts              # ポイント合計ヘルパー
    └── components/
        ├── BacklogPanel.tsx
        ├── SprintPanel.tsx
        ├── Board.tsx          # 列 droppable + 列合計
        ├── ItemCard.tsx       # ドラッグハンドル・ポイント編集
        └── ItemForm.tsx
```

## Sprint 1 でできること

1. **バックログ**: 追加 / 編集 / 削除（タイトル、任意の説明・ポイント）
2. **スプリント開始**: ゴール文言を入力して開始、アクティブゴールを表示
3. **Kanban**: Todo / Doing / Done 間をボタンで移動（バックログ ↔ Todo も可）
4. **永続化**: `localStorage`（初回はサンプルアイテムをシード）

## Sprint 2 でできること

1. **ポイント編集**: 各カード上でストーリーポイントをその場で変更（永続化）
2. **ドラッグ＆ドロップ**: ⋮⋮ ハンドルでバックログ / Todo / Doing / Done 間を移動（ボタン移動も併用可）
3. **合計表示**: バックログ合計、各列の合計、ボード（スプリント）合計

詳細は [`docs/SPRINT2.md`](docs/SPRINT2.md)。

---

## AI駆動スクラムの回し方

PO（あなた）と Dev/SM（AI）で、このリポジトリとボードを使って回す短いガイド。

### 1. バックログリファインメント

- PO が欲しい価値を日本語で伝える（受け入れ条件・優先度）
- AI がストーリー案・ポイント見積もり・分割案を提案
- 合意したものをこのアプリの**バックログ**に載せる

### 2. スプリントプランニング

- PO が Sprint Goal を決める（このアプリの「スプリントを開始」に書く）
- ゴールに必要なアイテムをバックログから **Todo** へ移す（DnD またはボタン）
- AI が実装順・リスク・完了の定義（DoD）を確認する

### 3. デイリー（Daily）

- ボードを見て Todo / Doing / Done を同期
- AI に「いま Doing の次の一手」やブロッカー解消を依頼
- 終わったカードは **完了 (Done)** へ

### 4. スプリントレビュー

- Done をデモ（`npm run dev`）
- `docs/SPRINTn.md` に達成・未達・オープンクエスチョンを残す
- PO が受け入れ可否と次の優先度を決める

### 5. レトロスペクティブ

- Keep / Problem / Try を短く洗い出し
- 次スプリントのプロセス改善（プロンプト、DoD、ボード運用）を1つ決める
- 必要なら README / docs を更新して学習を蓄積する

---

## ライセンス

学習・実験用。自由に改変して構いません。
