import { useEffect, useMemo, useState } from 'react'
import { BacklogPanel } from './components/BacklogPanel'
import { Board } from './components/Board'
import { SprintPanel } from './components/SprintPanel'
import { loadState, makeId, now, saveState } from './storage'
import type { AppState, BacklogItem, ColumnId } from './types'
import './App.css'

function App() {
  const [state, setState] = useState<AppState>(() => loadState())

  useEffect(() => {
    saveState(state)
  }, [state])

  const backlogItems = useMemo(
    () => state.items.filter((i) => i.column === 'backlog'),
    [state.items],
  )
  const boardItems = useMemo(
    () => state.items.filter((i) => i.column !== 'backlog'),
    [state.items],
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

      <div className="layout">
        <BacklogPanel
          items={backlogItems}
          onAdd={addItem}
          onUpdate={updateItem}
          onDelete={deleteItem}
          onMoveToTodo={(id) => moveItem(id, 'todo')}
        />
        <Board items={boardItems} onMove={moveItem} />
      </div>

      <footer className="app-footer">
        <span>Sprint 1 · 最小ボード</span>
        <span>永続化: localStorage</span>
      </footer>
    </div>
  )
}

export default App
