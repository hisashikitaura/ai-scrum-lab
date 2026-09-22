# AI Scrum Lab

日本語 UI の最小スクラムボード。**このアプリ自体がプロダクトであり、スプリントを回すボードでもある。**

## ロール

| 役割 | 誰 |
|------|-----|
| Product Owner (PO) | ユーザー |
| Development (+ Scrum Master 支援) | Grok Bot / エージェント |

Sprint 1 Goal: **バックログ → スプリント開始 → Todo / Doing / Done が動く最小ボード**

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
├── index.html                 # HTML エントリ
├── package.json
├── docs/
│   └── SPRINT1.md             # Sprint 1 レビュー用メモ
├── public/
│   └── favicon.svg
└── src/
    ├── main.tsx               # React マウント
    ├── App.tsx                # 状態・画面構成
    ├── App.css / index.css    # スタイル
    ├── types.ts               # BacklogItem / Sprint / AppState
    ├── storage.ts             # localStorage + 初期シード
    └── components/
        ├── BacklogPanel.tsx   # バックログ CRUD
        ├── SprintPanel.tsx    # スプリント開始・ゴール表示
        ├── Board.tsx          # Todo / Doing / Done
        ├── ItemCard.tsx       # カード UI・移動ボタン
        └── ItemForm.tsx       # 追加・編集フォーム
```

## Sprint 1 でできること

1. **バックログ**: 追加 / 編集 / 削除（タイトル、任意の説明・ポイント）
2. **スプリント開始**: ゴール文言を入力して開始、アクティブゴールを表示
3. **Kanban**: Todo / Doing / Done 間をボタンで移動（バックログ ↔ Todo も可）
4. **永続化**: `localStorage`（初回はサンプルアイテムをシード）

---

## AI駆動スクラムの回し方

PO（あなた）と Dev/SM（AI）で、このリポジトリとボードを使って回す短いガイド。

### 1. バックログリファインメント

- PO が欲しい価値を日本語で伝える（受け入れ条件・優先度）
- AI がストーリー案・ポイント見積もり・分割案を提案
- 合意したものをこのアプリの**バックログ**に載せる

### 2. スプリントプランニング

- PO が Sprint Goal を決める（このアプリの「スプリントを開始」に書く）
- ゴールに必要なアイテムをバックログから **Todo** へ移す
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
