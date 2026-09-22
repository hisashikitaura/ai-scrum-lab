import { useState, type FormEvent } from 'react'
import type { Sprint } from '../types'

interface SprintPanelProps {
  sprint: Sprint | null
  onStart: (goal: string) => void
}

export function SprintPanel({ sprint, onStart }: SprintPanelProps) {
  const [goal, setGoal] = useState('')
  const [replacing, setReplacing] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const g = goal.trim()
    if (!g) return
    onStart(g)
    setGoal('')
    setReplacing(false)
  }

  const showForm = !sprint?.active || replacing

  return (
    <section className="panel sprint-panel">
      <header className="panel-header">
        <h2>スプリント</h2>
      </header>

      {sprint?.active && !replacing && (
        <div className="sprint-active">
          <div className="label">アクティブなスプリントゴール</div>
          <p className="sprint-goal">{sprint.goal}</p>
          <p className="sprint-meta">
            開始:{' '}
            {new Date(sprint.startedAt).toLocaleString('ja-JP', {
              timeZone: 'Asia/Tokyo',
            })}{' '}
            (JST)
          </p>
          <div className="form-actions" style={{ marginTop: '0.75rem' }}>
            <button type="button" className="btn btn-sm" onClick={() => setReplacing(true)}>
              新しいスプリントを開始…
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <form className="item-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="sprint-goal">スプリントゴール</label>
            <input
              id="sprint-goal"
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="例: 最小ボードが動くこと"
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              スプリントを開始
            </button>
            {replacing && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setReplacing(false)
                  setGoal('')
                }}
              >
                キャンセル
              </button>
            )}
          </div>
        </form>
      )}
    </section>
  )
}
