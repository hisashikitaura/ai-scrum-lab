import { useDroppable } from '@dnd-kit/core'
import type { BacklogItem, ColumnId } from '../types'
import { formatPoints, sumPoints } from '../points'
import { ItemCard } from './ItemCard'

const COLUMNS: { id: Exclude<ColumnId, 'backlog'>; label: string }[] = [
  { id: 'todo', label: 'Todo' },
  { id: 'doing', label: 'Doing' },
  { id: 'done', label: '完了 (Done)' },
]

function moveTargetsFor(column: ColumnId): { column: ColumnId; label: string }[] {
  switch (column) {
    case 'todo':
      return [
        { column: 'doing', label: '→ Doing' },
        { column: 'backlog', label: '← バックログ' },
      ]
    case 'doing':
      return [
        { column: 'todo', label: '← Todo' },
        { column: 'done', label: '→ 完了' },
      ]
    case 'done':
      return [{ column: 'doing', label: '← Doing' }]
    default:
      return []
  }
}

function ColumnDropZone({
  id,
  label,
  items,
  onMove,
  onPointsChange,
}: {
  id: Exclude<ColumnId, 'backlog'>
  label: string
  items: BacklogItem[]
  onMove: (id: string, column: ColumnId) => void
  onPointsChange: (id: string, points: number | undefined) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id })
  const points = sumPoints(items)

  return (
    <div
      ref={setNodeRef}
      className={`column column-${id}${isOver ? ' column-over' : ''}`}
    >
      <div className="column-header">
        <h3>{label}</h3>
        <div className="column-meta">
          <span className="count">{items.length}</span>
          <span className="points-total" title="列のポイント合計">
            {formatPoints(points)}
          </span>
        </div>
      </div>
      <div className="column-body">
        {items.length === 0 && <p className="empty">ドロップまたはボタンで移動</p>}
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onMove={onMove}
            onPointsChange={onPointsChange}
            moveTargets={moveTargetsFor(id)}
            showActions
            draggable
          />
        ))}
      </div>
    </div>
  )
}

interface BoardProps {
  items: BacklogItem[]
  onMove: (id: string, column: ColumnId) => void
  onPointsChange: (id: string, points: number | undefined) => void
}

export function Board({ items, onMove, onPointsChange }: BoardProps) {
  const sprintTotal = sumPoints(items)

  return (
    <section className="board">
      <header className="panel-header">
        <h2>ボード</h2>
        <div className="totals-row">
          <span className="count">{items.length} 件</span>
          <span className="points-total points-total-lg" title="スプリント合計">
            合計 {formatPoints(sprintTotal)}
          </span>
        </div>
      </header>
      <p className="hint">カード左の ⋮⋮ をドラッグして列間移動（ボタンでも可）</p>
      <div className="board-columns">
        {COLUMNS.map((col) => (
          <ColumnDropZone
            key={col.id}
            id={col.id}
            label={col.label}
            items={items.filter((i) => i.column === col.id)}
            onMove={onMove}
            onPointsChange={onPointsChange}
          />
        ))}
      </div>
    </section>
  )
}
