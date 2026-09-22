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
import { loadState, makeId, now, saveState } from './storage'
import type { AppState, BacklogItem, ColumnId } from './types'
import './App.css'

const COLUMN_IDS: ColumnId[] = ['backlog', 'todo', 'doing', 'done']

function isColumnId(id: string): id is ColumnId {
  return (COLUMN_IDS as string[]).includes(id)
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
    setState((s) => ({
      ...s,
      items: s.items.map((i) =>
        i.id === id
          ? {
              ...i,
              title: data.title,
              description: data.description,
              points: data.points,
              updatedAt: now(),
            }
          : i,
      ),
    }))
  }

  function setItemPoints(id: string, points: number | undefined) {
    setState((s) => ({
      ...s,
      items: s.items.map((i) =>
        i.id === id ? { ...i, points, updatedAt: now() } : i,
      ),
    }))
  }

  function deleteItem(id: string) {
    setState((s) => ({ ...s, items: s.items.filter((i) => i.id !== id) }))
  }

  function moveItem(id: string, column: ColumnId) {
    setState((s) => ({
      ...s,
      items: s.items.map((i) =>
        i.id === id ? { ...i, column, updatedAt: now() } : i,
      ),
    }))
  }

  function startSprint(goal: string) {
    setState((s) => ({
      ...s,
      sprint: {
        id: makeId(),
        goal,
        startedAt: now(),
        active: true,
      },
    }))
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

      <SprintPanel sprint={state.sprint} onStart={startSprint} />

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
        <span>Sprint 2 · DnD / ポイント / 合計</span>
        <span>永続化: localStorage</span>
      </footer>
    </div>
  )
}

export default App
