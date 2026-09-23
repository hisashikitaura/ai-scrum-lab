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
  wipLimit,
  onMove,
  onPointsChange,
  onAddCriterion,
  onToggleCriterion,
  onRemoveCriterion,
  onWipLimitChange,
}: {
  id: Exclude<ColumnId, 'backlog'>
  label: string
  items: BacklogItem[]
  wipLimit?: number
  onMove: (id: string, column: ColumnId) => void
  onPointsChange: (id: string, points: number | undefined) => void
  onAddCriterion: (itemId: string, text: string) => void
  onToggleCriterion: (itemId: string, criterionId: string) => void
  onRemoveCriterion: (itemId: string, criterionId: string) => void
  onWipLimitChange?: (limit: number | undefined) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id })
  const points = sumPoints(items)
  const atWip =
    id === 'doing' && typeof wipLimit === 'number' && wipLimit > 0 && items.length >= wipLimit

  return (
    <div
      ref={setNodeRef}
      className={`column column-${id}${isOver ? ' column-over' : ''}${atWip ? ' column-wip-full' : ''}`}
    >
      <div className="column-header">
        <h3>{label}</h3>
        <div className="column-meta">
          {id === 'doing' && typeof wipLimit === 'number' && wipLimit > 0 ? (
            <span
              className={`count wip-count${atWip ? ' wip-count-full' : ''}`}
              title="Doing の枚数 / WIP 上限"
            >
              {items.length}/{wipLimit}
            </span>
          ) : (
            <span className="count">{items.length}</span>
          )}
          <span className="points-total" title="列のポイント合計">
            {formatPoints(points)}
          </span>
        </div>
      </div>

      {id === 'doing' && onWipLimitChange && (
        <div className="wip-config">
          <label htmlFor="wip-limit-doing">
            WIP 上限
            <input
              id="wip-limit-doing"
              type="number"
              min={0}
              step={1}
              className="wip-input"
              value={wipLimit && wipLimit > 0 ? wipLimit : ''}
              placeholder="なし"
              title="0 または空で制限なし"
              aria-label="Doing の WIP 上限"
              onChange={(e) => {
                const raw = e.target.value.trim()
                if (raw === '') {
                  onWipLimitChange(undefined)
                  return
                }
                const n = Number(raw)
                if (!Number.isNaN(n) && n >= 0) {
                  onWipLimitChange(n === 0 ? undefined : Math.floor(n))
                }
              }}
            />
          </label>
          {atWip && <span className="wip-warn">上限到達</span>}
        </div>
      )}

      <div className="column-body">
        {items.length === 0 && <p className="empty">ドロップまたはボタンで移動</p>}
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onMove={onMove}
            onPointsChange={onPointsChange}
            onAddCriterion={onAddCriterion}
            onToggleCriterion={onToggleCriterion}
            onRemoveCriterion={onRemoveCriterion}
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
  wipLimitDoing?: number
  onMove: (id: string, column: ColumnId) => void
  onPointsChange: (id: string, points: number | undefined) => void
  onAddCriterion: (itemId: string, text: string) => void
  onToggleCriterion: (itemId: string, criterionId: string) => void
  onRemoveCriterion: (itemId: string, criterionId: string) => void
  onWipLimitChange: (limit: number | undefined) => void
}

export function Board({
  items,
  wipLimitDoing,
  onMove,
  onPointsChange,
  onAddCriterion,
  onToggleCriterion,
  onRemoveCriterion,
  onWipLimitChange,
}: BoardProps) {
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
      <p className="hint">
        カード左の ⋮⋮ をドラッグして列間移動（ボタンでも可）。Doing は WIP
        上限あり。未完了の受け入れ条件があるカードを Done へ移すと確認が出ます。
      </p>
      <div className="board-columns">
        {COLUMNS.map((col) => (
          <ColumnDropZone
            key={col.id}
            id={col.id}
            label={col.label}
            items={items.filter((i) => i.column === col.id)}
            wipLimit={col.id === 'doing' ? wipLimitDoing : undefined}
            onMove={onMove}
            onPointsChange={onPointsChange}
            onAddCriterion={onAddCriterion}
            onToggleCriterion={onToggleCriterion}
            onRemoveCriterion={onRemoveCriterion}
            onWipLimitChange={col.id === 'doing' ? onWipLimitChange : undefined}
          />
        ))}
      </div>
    </section>
  )
}
