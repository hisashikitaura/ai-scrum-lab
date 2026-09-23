import type { BurndownSnapshot } from '../types'
import { formatPoints } from '../points'

interface BurndownChartProps {
  snapshots: BurndownSnapshot[]
  committedPoints?: number
}

export function BurndownChart({ snapshots, committedPoints }: BurndownChartProps) {
  if (snapshots.length === 0) {
    return <p className="empty">まだスナップショットがありません</p>
  }

  const width = 320
  const height = 140
  const pad = { top: 12, right: 12, bottom: 24, left: 36 }
  const innerW = width - pad.left - pad.right
  const innerH = height - pad.top - pad.bottom

  const maxRem = Math.max(
    committedPoints ?? 0,
    ...snapshots.map((s) => s.remaining),
    1,
  )
  const n = snapshots.length
  const xAt = (i: number) =>
    pad.left + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW)
  const yAt = (v: number) => pad.top + innerH - (v / maxRem) * innerH

  const points = snapshots
    .map((s, i) => `${xAt(i).toFixed(1)},${yAt(s.remaining).toFixed(1)}`)
    .join(' ')

  const idealEnd = snapshots[snapshots.length - 1]
  const idealStart = committedPoints ?? snapshots[0].remaining
  const idealLine =
    n >= 1
      ? `${xAt(0).toFixed(1)},${yAt(idealStart).toFixed(1)} ${xAt(n - 1).toFixed(1)},${yAt(0).toFixed(1)}`
      : ''

  const latest = snapshots[snapshots.length - 1]

  return (
    <div className="burndown">
      <div className="burndown-meta">
        <span>残 {formatPoints(latest.remaining)}</span>
        {committedPoints != null && (
          <span className="muted">開始時コミット {formatPoints(committedPoints)}</span>
        )}
        <span className="muted">{snapshots.length} 点</span>
      </div>
      <svg
        className="burndown-svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="バーンダウンチャート"
      >
        <line
          x1={pad.left}
          y1={pad.top}
          x2={pad.left}
          y2={pad.top + innerH}
          className="burndown-axis"
        />
        <line
          x1={pad.left}
          y1={pad.top + innerH}
          x2={pad.left + innerW}
          y2={pad.top + innerH}
          className="burndown-axis"
        />
        <text x={4} y={pad.top + 4} className="burndown-label">
          {maxRem}
        </text>
        <text x={4} y={pad.top + innerH} className="burndown-label">
          0
        </text>
        {idealLine && (
          <polyline points={idealLine} className="burndown-ideal" fill="none" />
        )}
        <polyline points={points} className="burndown-actual" fill="none" />
        {snapshots.map((s, i) => (
          <circle
            key={`${s.at}-${i}`}
            cx={xAt(i)}
            cy={yAt(s.remaining)}
            r={3.5}
            className="burndown-dot"
          />
        ))}
        {idealEnd && (
          <text
            x={pad.left + innerW}
            y={height - 6}
            textAnchor="end"
            className="burndown-label"
          >
            時間 →
          </text>
        )}
      </svg>
      <p className="hint burndown-hint">
        実線 = 残ポイント / 点線 = 理想線（開始コミット → 0）
      </p>
    </div>
  )
}
