import { useState, type FormEvent } from 'react'
import { formatPoints } from '../points'
import type { Sprint } from '../types'
import { BurndownChart } from './BurndownChart'

interface SprintPanelProps {
  sprint: Sprint | null
  /** Done 列の現在ポイント（終了確認ダイアログ用） */
  donePoints: number
  onStart: (goal: string) => void
  onEnd: () => void
  onRetroChange: (
    field: 'retroStart' | 'retroDuring' | 'retroEnd',
    value: string,
  ) => void
}

export function SprintPanel({
  sprint,
  donePoints,
  onStart,
  onEnd,
  onRetroChange,
}: SprintPanelProps) {
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

  function handleEnd() {
    const pts = formatPoints(donePoints)
    if (
      !window.confirm(
        `Done 列の ${pts} をベロシティ履歴に記録してスプリントを終了しますか？`,
      )
    ) {
      return
    }
    onEnd()
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

          <ol className="end-flow-guide">
            <li>終了時レトロを書く</li>
            <li>「終了してベロシティに記録」を押す</li>
            <li>下のベロシティパネルを確認する</li>
          </ol>

          <div className="retro-block">
            <h3 className="retro-heading">レトロメモ</h3>
            <div className="field">
              <label htmlFor="retro-start">開始時</label>
              <textarea
                id="retro-start"
                rows={2}
                value={sprint.retroStart ?? ''}
                onChange={(e) => onRetroChange('retroStart', e.target.value)}
                placeholder="期待・不安など"
              />
            </div>
            <div className="field">
              <label htmlFor="retro-during">途中</label>
              <textarea
                id="retro-during"
                rows={2}
                value={sprint.retroDuring ?? ''}
                onChange={(e) => onRetroChange('retroDuring', e.target.value)}
                placeholder="気づき・ブロッカー"
              />
            </div>
            <div className="field">
              <label htmlFor="retro-end">終了時</label>
              <textarea
                id="retro-end"
                rows={2}
                value={sprint.retroEnd ?? ''}
                onChange={(e) => onRetroChange('retroEnd', e.target.value)}
                placeholder="Keep / Problem / Try"
              />
            </div>
          </div>

          <div className="burndown-block">
            <h3 className="retro-heading">バーンダウン</h3>
            <BurndownChart
              snapshots={sprint.burndown ?? []}
              committedPoints={sprint.committedPoints}
            />
          </div>

          <div className="form-actions end-flow-actions" style={{ marginTop: '0.75rem' }}>
            <button type="button" className="btn btn-primary" onClick={handleEnd}>
              終了してベロシティに記録
            </button>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => setReplacing(true)}
            >
              新しいスプリントを開始…
            </button>
          </div>
          <p className="hint end-flow-hint">
            主ボタンは終了のみ（履歴へ記録）。副ボタンは終了してから別ゴールで新規開始します。
          </p>
        </div>
      )}

      {showForm && (
        <form className="item-form" onSubmit={handleSubmit}>
          {sprint?.active && replacing && (
            <p className="hint">
              開始すると現在のスプリントを終了し、Done の{' '}
              {formatPoints(donePoints)}{' '}
              を履歴に残してから新しいゴールで開始します。
            </p>
          )}
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
