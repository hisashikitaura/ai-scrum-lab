# Sprint 4 Review

**Sprint Goal:** Doing の枚数上限を守れ、カードごとに受け入れ条件をチェックできる

**期間メモ:** Sprint 3（レトロ / ベロシティ / バーンダウン）の上に WIP 上限・受け入れ条件・Done 警告を追加

## 完了したストーリー

| # | ストーリー | 状態 |
|---|------------|------|
| 1 | Doing の WIP 上限（設定・件数表示・超過時ブロック、確認で上書き可） | Done |
| 2 | カードごとの受け入れ条件チェックリスト（追加 / トグル / 削除、永続化） | Done |
| 3 | 未完了 AC があるカードを Done へ移すときの確認ダイアログ | Done |
| 4 | `docs/SPRINT4.md` / README 更新、`npm run build` 通過 | Done |

## デモ手順

```bash
npm install
npm run dev
```

1. 「データ初期化」で Sprint 4 サンプルを載せる（Doing に 1 枚、WIP 上限 3）
2. **WIP 上限**
   - Doing ヘッダに `1/3` が表示されること
   - 上限入力を `1` に変える → 「上限到達」表示
   - Todo から Doing へ移動（ボタンまたは DnD）→ ブロック確認が出ること。キャンセルで移動しない / OK で強制移動
   - リロードしても上限値が残ること
3. **受け入れ条件**
   - Doing カードのチェックリストをトグル / 追加 / × で削除
   - リロードしても残ること
4. **Done 警告**
   - 未チェックの AC があるカードを「→ 完了」または DnD で Done へ → 確認ダイアログ
   - すべてチェック済み、または AC なしのカードは確認なしで Done へ

## 技術メモ

- 状態: `AppState.wipLimitDoing?: number`（未設定 / 0 以下 = 制限なし）
- カード: `BacklogItem.acceptanceCriteria?: { id, text, done }[]`
- 移動は `requestMove` に集約（ボタン・DnD 共通）。WIP 超過は confirm で上書き可。Done は未完了 AC があると confirm
- 既存キー `ai-scrum-lab:v1` を拡張（旧データは正規化で AC / WIP 欠落を許容）

## オープンクエスチョン（次へ）

1. WIP 超過を完全ブロック（上書き不可）にするか？
2. AC 全完了を Done のハード要件にするか？
3. 列ごとの WIP（Todo など）やチーム全体の WIP は必要か？
