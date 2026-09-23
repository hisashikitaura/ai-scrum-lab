import type { SprintRecord } from '../types'
import { averageVelocity, formatPoints } from '../points'

interface VelocityPanelProps {
  history: SprintRecord[]
}

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
}

export function VelocityPanel({ history }: VelocityPanelProps) {
  const avg = averageVelocity(history.map((h) => h.completedPoints))

  return (
    <section className="panel velocity-panel">
      <header className="panel-header">
        <h2>ベロシティ</h2>
        <div className="totals-row">
          <span className="count">{history.length} 件</span>
          {history.length > 0 && (
            <span className="points-total points-total-lg">
              平均 {formatPoints(avg)}
            </span>
          )}
        </div>
      </header>

      {history.length === 0 ? (
        <p className="empty">終了したスプリントがまだありません</p>
      ) : (
        <ul className="velocity-list">
          {history.map((h) => (
            <li key={h.id} className="velocity-item">
              <div className="velocity-item-main">
                <strong className="velocity-goal">{h.goal}</strong>
                <span className="badge points">{formatPoints(h.completedPoints)}</span>
              </div>
              <p className="velocity-meta">
                {formatWhen(h.startedAt)} → {formatWhen(h.endedAt)} (JST)
                {' · '}
                コミット {formatPoints(h.committedPoints)}
              </p>
              {(h.retroEnd || h.retroDuring || h.retroStart) && (
                <details className="velocity-retro">
                  <summary>レトロメモ</summary>
                  {h.retroStart && (
                    <p>
                      <span className="label">開始</span> {h.retroStart}
                    </p>
                  )}
                  {h.retroDuring && (
                    <p>
                      <span className="label">途中</span> {h.retroDuring}
                    </p>
                  )}
                  {h.retroEnd && (
                    <p>
                      <span className="label">終了</span> {h.retroEnd}
                    </p>
                  )}
                </details>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
