import type { AcceptanceCriterion, AppState, BacklogItem } from './types'

const STORAGE_KEY = 'ai-scrum-lab:v1'

const now = () => new Date().toISOString()

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

const DEFAULT_WIP_LIMIT = 3

function normalizeCriteria(raw: unknown): AcceptanceCriterion[] | undefined {
  if (!Array.isArray(raw)) return undefined
  const list = raw
    .filter((c): c is Record<string, unknown> => !!c && typeof c === 'object')
    .map((c) => ({
      id: typeof c.id === 'string' ? c.id : makeId(),
      text: typeof c.text === 'string' ? c.text : '',
      done: Boolean(c.done),
    }))
    .filter((c) => c.text.trim().length > 0)
  return list.length > 0 ? list : undefined
}

function normalizeItem(raw: Partial<BacklogItem> & { id?: string }): BacklogItem | null {
  if (!raw || typeof raw.id !== 'string' || typeof raw.title !== 'string') return null
  const column = raw.column
  if (
    column !== 'backlog' &&
    column !== 'todo' &&
    column !== 'doing' &&
    column !== 'done'
  ) {
    return null
  }
  return {
    id: raw.id,
    title: raw.title,
    description: typeof raw.description === 'string' ? raw.description : undefined,
    points: typeof raw.points === 'number' ? raw.points : undefined,
    column,
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : now(),
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : now(),
    acceptanceCriteria: normalizeCriteria(raw.acceptanceCriteria),
  }
}

export function createSeedItems(): BacklogItem[] {
  const t = now()
  return [
    {
      id: makeId(),
      title: 'Doing の WIP 上限',
      description: '設定可能な上限・件数表示・超過時はブロック（確認で上書き可）',
      points: 3,
      column: 'todo',
      createdAt: t,
      updatedAt: t,
      acceptanceCriteria: [
        { id: makeId(), text: 'Doing ヘッダに N/上限 が表示される', done: false },
        { id: makeId(), text: '上限到達時にドロップ/移動がブロックされる', done: false },
        { id: makeId(), text: '上限値が localStorage に残る', done: false },
      ],
    },
    {
      id: makeId(),
      title: '受け入れ条件チェックリスト',
      description: 'カードごとに追加・トグル・削除。永続化',
      points: 5,
      column: 'doing',
      createdAt: t,
      updatedAt: t,
      acceptanceCriteria: [
        { id: makeId(), text: '項目を追加できる', done: true },
        { id: makeId(), text: 'チェックを切り替えられる', done: false },
        { id: makeId(), text: '項目を削除できる', done: false },
      ],
    },
    {
      id: makeId(),
      title: 'Done 移動時の AC 警告',
      description: '未チェックの受け入れ条件があるとき確認ダイアログ',
      points: 2,
      column: 'todo',
      createdAt: t,
      updatedAt: t,
      acceptanceCriteria: [
        { id: makeId(), text: '未完了 AC があると確認が出る', done: false },
        { id: makeId(), text: 'AC なし / 全完了なら確認なしで Done へ', done: false },
      ],
    },
    {
      id: makeId(),
      title: 'Sprint 4 ドキュメント',
      description: 'docs/SPRINT4.md と README 更新',
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
  const items = parsed.items
    .map((i) => normalizeItem(i as Partial<BacklogItem>))
    .filter((i): i is BacklogItem => i != null)
  const wipRaw = parsed.wipLimitDoing
  const wipLimitDoing =
    typeof wipRaw === 'number' && wipRaw > 0 ? Math.floor(wipRaw) : undefined
  return {
    items,
    sprint: parsed.sprint ?? null,
    history: Array.isArray(parsed.history) ? parsed.history : [],
    seeded: Boolean(parsed.seeded),
    wipLimitDoing,
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
      goal: 'Doing の枚数上限を守れ、カードごとに受け入れ条件をチェックできる',
      startedAt: t,
      active: true,
      committedPoints: committed,
      burndown: [{ at: t, remaining }],
      retroStart:
        'Sprint 4 開始。WIP 上限・受け入れ条件・Done 警告を実装する。',
    },
    history: [],
    seeded: true,
    wipLimitDoing: DEFAULT_WIP_LIMIT,
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export { makeId, now, DEFAULT_WIP_LIMIT }
