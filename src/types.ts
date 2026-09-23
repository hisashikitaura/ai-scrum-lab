export type ColumnId = 'backlog' | 'todo' | 'doing' | 'done'

/** カードごとの受け入れ条件（チェックリスト） */
export interface AcceptanceCriterion {
  id: string
  text: string
  done: boolean
}

export interface BacklogItem {
  id: string
  title: string
  description?: string
  points?: number
  column: ColumnId
  createdAt: string
  updatedAt: string
  /** 受け入れ条件チェックリスト */
  acceptanceCriteria?: AcceptanceCriterion[]
}

/** 残ポイントの時系列（バーンダウン） */
export interface BurndownSnapshot {
  at: string
  remaining: number
}

export interface Sprint {
  id: string
  goal: string
  startedAt: string
  active: boolean
  endedAt?: string
  /** 開始時点のボード合計（Todo+Doing+Done） */
  committedPoints?: number
  burndown?: BurndownSnapshot[]
  retroStart?: string
  retroDuring?: string
  retroEnd?: string
}

/** 終了済みスプリント（ベロシティ履歴） */
export interface SprintRecord {
  id: string
  goal: string
  startedAt: string
  endedAt: string
  completedPoints: number
  committedPoints: number
  retroStart?: string
  retroDuring?: string
  retroEnd?: string
}

export interface AppState {
  items: BacklogItem[]
  sprint: Sprint | null
  history: SprintRecord[]
  seeded: boolean
  /**
   * Doing 列の WIP 上限。
   * undefined / null / 0 以下 = 制限なし
   */
  wipLimitDoing?: number
}

/** 未完了の受け入れ条件があるか */
export function hasIncompleteAcceptance(item: BacklogItem): boolean {
  const list = item.acceptanceCriteria ?? []
  return list.some((c) => !c.done)
}

/** 受け入れ条件の完了数サマリ */
export function acceptanceSummary(item: BacklogItem): {
  total: number
  done: number
} {
  const list = item.acceptanceCriteria ?? []
  return {
    total: list.length,
    done: list.filter((c) => c.done).length,
  }
}
