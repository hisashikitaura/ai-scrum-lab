import type { AppState, BacklogItem } from './types'

const STORAGE_KEY = 'ai-scrum-lab:v1'

const now = () => new Date().toISOString()

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function createSeedItems(): BacklogItem[] {
  const t = now()
  return [
    {
      id: makeId(),
      title: 'バックログの追加・編集・削除',
      description: 'タイトル・説明・ポイントを管理できるようにする',
      points: 3,
      column: 'todo',
      createdAt: t,
      updatedAt: t,
    },
    {
      id: makeId(),
      title: 'スプリント開始とゴール表示',
      description: 'スプリントゴールを設定し、ボード上に表示する',
      points: 2,
      column: 'todo',
      createdAt: t,
      updatedAt: t,
    },
    {
      id: makeId(),
      title: 'Kanban 列間の移動',
      description: 'Todo / Doing / Done をボタンで行き来できるようにする',
      points: 3,
      column: 'doing',
      createdAt: t,
      updatedAt: t,
    },
    {
      id: makeId(),
      title: 'localStorage への永続化',
      description: 'リロードしてもデータが残ること',
      points: 2,
      column: 'backlog',
      createdAt: t,
      updatedAt: t,
    },
    {
      id: makeId(),
      title: 'README と Sprint Review 資料',
      description: '使い方と AI駆動スクラムの回し方を書く',
      points: 1,
      column: 'backlog',
      createdAt: t,
      updatedAt: t,
    },
  ]
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as AppState
      if (parsed && Array.isArray(parsed.items)) {
        return parsed
      }
    }
  } catch {
    // ignore corrupt storage
  }
  return {
    items: createSeedItems(),
    sprint: {
      id: makeId(),
      goal: 'バックログ → スプリント開始 → Todo/Doing/Done が動く最小ボード',
      startedAt: now(),
      active: true,
    },
    seeded: true,
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export { makeId, now }
