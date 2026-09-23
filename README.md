# AI Scrum Lab

日本語 UI の最小スクラムボード。**このアプリ自体がプロダクトであり、スプリントを回すボードでもある。**

## ロール

| 役割 | 誰 |
|------|-----|
| Product Owner (PO) | ユーザー |
| Development (+ Scrum Master 支援) | Grok Bot / エージェント |

Sprint 3 Goal: **スプリントの振り返りを残せ、完了点数の履歴と簡易バーンダウンが見える**

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
│   ├── SPRINT2.md
│   └── SPRINT3.md             # Sprint 3 レビュー用メモ
├── public/
│   └── favicon.svg
└── src/
    ├── main.tsx
    ├── App.tsx                # 状態・DnD・終了/バーンダウン
    ├── App.css / index.css
    ├── types.ts
    ├── storage.ts
    ├── points.ts              # 合計・残ポイント・平均ベロシティ
    └── components/
        ├── BacklogPanel.tsx
        ├── SprintPanel.tsx    # ゴール・レトロ・バーンダウン・終了
        ├── VelocityPanel.tsx  # 完了スプリント履歴
        ├── BurndownChart.tsx  # SVG バーンダウン
        ├── Board.tsx
        ├── ItemCard.tsx
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

## Sprint 3 でできること

1. **レトロメモ**: 開始時 / 途中 / 終了時のメモをスプリントに保存
2. **スプリント終了 → 履歴**: Done の完了点数をベロシティ履歴へ。平均 pt を表示
3. **簡易バーンダウン**: 残ポイント（Todo+Doing）の推移を SVG 表示（列移動・ポイント変更でスナップショット）

詳細は [`docs/SPRINT3.md`](docs/SPRINT3.md)。

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
- バーンダウンとレトロ「途中」メモを軽く更新

### 4. スプリントレビュー

- Done をデモ（`npm run dev`）
- `docs/SPRINTn.md` に達成・未達・オープンクエスチョンを残す
- PO が受け入れ可否と次の優先度を決める

### 5. レトロスペクティブ

- ボード上のレトロメモ（開始 / 途中 / 終了）に Keep / Problem / Try を短く書く
- 「スプリントを終了」で完了点数を履歴に残す
- 次スプリントのプロセス改善を1つ決める

---

## ライセンス

学習・実験用。自由に改変して構いません。
