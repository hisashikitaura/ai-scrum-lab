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

export interface Sprint {
  id: string
  goal: string
  startedAt: string
  active: boolean
}

export interface AppState {
  items: BacklogItem[]
  sprint: Sprint | null
  seeded: boolean
}
