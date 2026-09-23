export type ColumnId = 'backlog' | 'todo' | 'doing' | 'done'

export interface BacklogItem {
  id: string
  title: string
  description?: string
  points?: number
  column: ColumnId
  createdAt: string
  updatedAt: string
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
}
