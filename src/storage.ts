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
      title: 'カードのストーリーポイント編集',
      description: '各カードでポイントを付け・変更し、localStorage に残す',
      points: 2,
      column: 'todo',
      createdAt: t,
      updatedAt: t,
    },
    {
      id: makeId(),
      title: '列間ドラッグ＆ドロップ',
      description: 'Todo / Doing / Done（とバックログ）を DnD で移動',
      points: 5,
      column: 'todo',
      createdAt: t,
      updatedAt: t,
    },
    {
      id: makeId(),
      title: 'ポイント合計の表示',
      description: 'バックログ合計とボード列・スプリント合計を出す',
      points: 2,
      column: 'doing',
      createdAt: t,
      updatedAt: t,
    },
    {
      id: makeId(),
      title: 'Sprint 2 ドキュメント',
      description: 'docs/SPRINT2.md と README 更新',
      points: 1,
      column: 'backlog',
      createdAt: t,
      updatedAt: t,
    },
    {
      id: makeId(),
      title: 'ボタン移動の維持',
      description: 'DnD できなくても従来の移動ボタンで操作できること',
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
      goal: 'カードを列間でドラッグでき、各カードにポイントを付けられる',
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
