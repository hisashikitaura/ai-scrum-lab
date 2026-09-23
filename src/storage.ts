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
      title: 'レトロメモの保存',
      description: 'スプリント開始・途中・終了のメモを localStorage に残す',
      points: 3,
      column: 'todo',
      createdAt: t,
      updatedAt: t,
    },
    {
      id: makeId(),
      title: 'スプリント終了とベロシティ',
      description: '終了時に Done 点数を履歴へ。完了スプリントの平均を表示',
      points: 5,
      column: 'todo',
      createdAt: t,
      updatedAt: t,
    },
    {
      id: makeId(),
      title: '簡易バーンダウン',
      description: '残ポイントの推移を SVG で表示（ステータス変更でスナップショット）',
      points: 5,
      column: 'doing',
      createdAt: t,
      updatedAt: t,
    },
    {
      id: makeId(),
      title: 'Sprint 3 ドキュメント',
      description: 'docs/SPRINT3.md と README 更新',
      points: 1,
      column: 'backlog',
      createdAt: t,
      updatedAt: t,
    },
    {
      id: makeId(),
      title: 'ビルド確認',
      description: 'npm run build が通ること',
      points: 1,
      column: 'backlog',
      createdAt: t,
      updatedAt: t,
    },
  ]
}

function normalizeState(parsed: Partial<AppState>): AppState | null {
  if (!parsed || !Array.isArray(parsed.items)) return null
  return {
    items: parsed.items,
    sprint: parsed.sprint ?? null,
    history: Array.isArray(parsed.history) ? parsed.history : [],
    seeded: Boolean(parsed.seeded),
  }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppState>
      const normalized = normalizeState(parsed)
      if (normalized) return normalized
    }
  } catch {
    // ignore corrupt storage
  }
  const items = createSeedItems()
  const remaining = items
    .filter((i) => i.column === 'todo' || i.column === 'doing')
    .reduce((s, i) => s + (i.points ?? 0), 0)
  const committed = items
    .filter((i) => i.column !== 'backlog')
    .reduce((s, i) => s + (i.points ?? 0), 0)
  const t = now()
  return {
    items,
    sprint: {
      id: makeId(),
      goal: 'スプリントの振り返りを残せ、完了点数の履歴と簡易バーンダウンが見える',
      startedAt: t,
      active: true,
      committedPoints: committed,
      burndown: [{ at: t, remaining }],
      retroStart: 'Sprint 3 開始。レトロ・ベロシティ・バーンダウンを実装する。',
    },
    history: [],
    seeded: true,
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export { makeId, now }
