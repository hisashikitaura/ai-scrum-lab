import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { useEffect, useMemo, useState } from 'react'
import { BacklogPanel } from './components/BacklogPanel'
import { Board } from './components/Board'
import { ItemCard } from './components/ItemCard'
import { SprintPanel } from './components/SprintPanel'
import { VelocityPanel } from './components/VelocityPanel'
import {
  boardPoints,
  donePoints,
  remainingPoints,
} from './points'
import { loadState, makeId, now, saveState } from './storage'
import type { AppState, BacklogItem, ColumnId, SprintRecord } from './types'
import './App.css'

const COLUMN_IDS: ColumnId[] = ['backlog', 'todo', 'doing', 'done']

function isColumnId(id: string): id is ColumnId {
  return (COLUMN_IDS as string[]).includes(id)
}

function archiveSprint(s: AppState): { state: AppState; record: SprintRecord | null } {
  if (!s.sprint?.active) return { state: s, record: null }
  const endedAt = now()
  const completed = donePoints(s.items)
  const committed = s.sprint.committedPoints ?? boardPoints(s.items)
  const record: SprintRecord = {
    id: s.sprint.id,
    goal: s.sprint.goal,
    startedAt: s.sprint.startedAt,
    endedAt,
    completedPoints: completed,
    committedPoints: committed,
    retroStart: s.sprint.retroStart,
    retroDuring: s.sprint.retroDuring,
    retroEnd: s.sprint.retroEnd,
  }
  return {
    state: {
      ...s,
      sprint: { ...s.sprint, active: false, endedAt },
      history: [record, ...s.history],
    },
    record,
  }
}

/** 残ポイントが変わったときだけバーンドウンスナップショットを追加 */
function withBurndownIfNeeded(s: AppState, items: BacklogItem[]): AppState {
  if (!s.sprint?.active) return { ...s, items }
  const rem = remainingPoints(items)
  const snaps = s.sprint.burndown ?? []
  const last = snaps[snaps.length - 1]
  if (last && last.remaining === rem) return { ...s, items }
  return {
    ...s,
    items,
    sprint: {
      ...s.sprint,
      burndown: [...snaps, { at: now(), remaining: rem }],
    },
  }
}

function App() {
  const [state, setState] = useState<AppState>(() => loadState())
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    saveState(state)
  }, [state])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  )

  const backlogItems = useMemo(
    () => state.items.filter((i) => i.column === 'backlog'),
    [state.items],
  )
  const boardItems = useMemo(
    () => state.items.filter((i) => i.column !== 'backlog'),
    [state.items],
  )
  const activeItem = useMemo(
    () => (activeId ? state.items.find((i) => i.id === activeId) ?? null : null),
    [activeId, state.items],
  )

  function addItem(data: { title: string; description?: string; points?: number }) {
    const t = now()
    const item: BacklogItem = {
      id: makeId(),
      title: data.title,
      description: data.description,
      points: data.points,
      column: 'backlog',
      createdAt: t,
      updatedAt: t,
    }
    setState((s) => ({ ...s, items: [item, ...s.items] }))
  }

  function updateItem(
    id: string,
    data: { title: string; description?: string; points?: number },
  ) {
    setState((s) => {
      const items = s.items.map((i) =>
        i.id === id
          ? {
              ...i,
              title: data.title,
              description: data.description,
              points: data.points,
              updatedAt: now(),
            }
          : i,
      )
      return withBurndownIfNeeded(s, items)
    })
  }

  function setItemPoints(id: string, points: number | undefined) {
    setState((s) => {
      const items = s.items.map((i) =>
        i.id === id ? { ...i, points, updatedAt: now() } : i,
      )
      return withBurndownIfNeeded(s, items)
    })
  }

  function deleteItem(id: string) {
    setState((s) => {
      const items = s.items.filter((i) => i.id !== id)
      return withBurndownIfNeeded(s, items)
    })
  }

  function moveItem(id: string, column: ColumnId) {
    setState((s) => {
      const items = s.items.map((i) =>
        i.id === id ? { ...i, column, updatedAt: now() } : i,
      )
      return withBurndownIfNeeded(s, items)
    })
  }

  function startSprint(goal: string) {
    setState((s) => {
      const { state: afterArchive } = archiveSprint(s)
      const t = now()
      const rem = remainingPoints(afterArchive.items)
      const committed = boardPoints(afterArchive.items)
      return {
        ...afterArchive,
        sprint: {
          id: makeId(),
          goal,
          startedAt: t,
          active: true,
          committedPoints: committed,
          burndown: [{ at: t, remaining: rem }],
        },
      }
    })
  }

  function endSprint() {
    setState((s) => archiveSprint(s).state)
  }

  function updateRetro(
    field: 'retroStart' | 'retroDuring' | 'retroEnd',
    value: string,
  ) {
    setState((s) => {
      if (!s.sprint) return s
      return { ...s, sprint: { ...s.sprint, [field]: value } }
    })
  }

  function resetData() {
    if (!window.confirm('すべてのデータを初期状態に戻しますか？')) return
    localStorage.removeItem('ai-scrum-lab:v1')
    setState(loadState())
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)
    const { active, over } = event
    if (!over) return

    const itemId = String(active.id)
    const overId = String(over.id)

    let targetColumn: ColumnId | null = null
    if (isColumnId(overId)) {
      targetColumn = overId
    } else {
      const overItem = state.items.find((i) => i.id === overId)
      if (overItem) targetColumn = overItem.column
    }

    if (!targetColumn) return
    const current = state.items.find((i) => i.id === itemId)
    if (!current || current.column === targetColumn) return
    moveItem(itemId, targetColumn)
  }

  function handleDragCancel() {
    setActiveId(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <p className="eyebrow">AI駆動スクラム · 学習ラボ</p>
          <h1>AI Scrum Lab</h1>
          <p className="tagline">
            あなた = Product Owner / Grok Bot = Dev（+ SM 支援）· このアプリ自体がボード
          </p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={resetData}>
          データ初期化
        </button>
      </header>

      <SprintPanel
        sprint={state.sprint}
        onStart={startSprint}
        onEnd={endSprint}
        onRetroChange={updateRetro}
      />

      <VelocityPanel history={state.history} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="layout">
          <BacklogPanel
            items={backlogItems}
            onAdd={addItem}
            onUpdate={updateItem}
            onDelete={deleteItem}
            onMove={moveItem}
            onPointsChange={setItemPoints}
          />
          <Board
            items={boardItems}
            onMove={moveItem}
            onPointsChange={setItemPoints}
          />
        </div>
        <DragOverlay dropAnimation={null}>
          {activeItem ? (
            <ItemCard item={activeItem} showActions={false} />
          ) : null}
        </DragOverlay>
      </DndContext>

      <footer className="app-footer">
        <span>Sprint 3 · レトロ / ベロシティ / バーンダウン</span>
        <span>永続化: localStorage</span>
      </footer>
    </div>
  )
}

export default App
