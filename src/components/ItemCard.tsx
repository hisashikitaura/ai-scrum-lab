import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { BacklogItem, ColumnId } from '../types'

interface ItemCardProps {
  item: BacklogItem
  onEdit?: (item: BacklogItem) => void
  onDelete?: (id: string) => void
  onMove?: (id: string, column: ColumnId) => void
  onPointsChange?: (id: string, points: number | undefined) => void
  moveTargets?: { column: ColumnId; label: string }[]
  showActions?: boolean
  draggable?: boolean
}

export function ItemCard({
  item,
  onEdit,
  onDelete,
  onMove,
  onPointsChange,
  moveTargets = [],
  showActions = true,
  draggable = false,
}: ItemCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: draggable ? item.id : `preview-${item.id}`,
    data: { column: item.column },
    disabled: !draggable,
  })

  const style = draggable
    ? {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.55 : 1,
        cursor: isDragging ? 'grabbing' : undefined,
      }
    : undefined

  return (
    <article
      ref={draggable ? setNodeRef : undefined}
      className={`item-card${isDragging ? ' item-card-dragging' : ''}${draggable ? ' item-card-draggable' : ''}`}
      style={style}
    >
      <div className="item-card-header">
        <div className="item-title-row">
          {draggable && (
            <button
              type="button"
              className="drag-handle"
              aria-label="ドラッグして移動"
              title="ドラッグして移動"
              {...listeners}
              {...attributes}
            >
              ⋮⋮
            </button>
          )}
          <h3 className="item-title">{item.title}</h3>
        </div>
        {onPointsChange ? (
          <label className="points-edit" title="ストーリーポイント">
            <input
              type="number"
              min={0}
              step={1}
              className="points-input"
              value={item.points ?? ''}
              placeholder="—"
              aria-label="ストーリーポイント"
              onChange={(e) => {
                const raw = e.target.value.trim()
                if (raw === '') {
                  onPointsChange(item.id, undefined)
                  return
                }
                const n = Number(raw)
                if (!Number.isNaN(n) && n >= 0) onPointsChange(item.id, Math.floor(n))
              }}
            />
            <span className="points-suffix">pt</span>
          </label>
        ) : (
          item.points != null && <span className="badge points">{item.points}pt</span>
        )}
      </div>
      {item.description && <p className="item-desc">{item.description}</p>}
      {showActions && (
        <div className="item-actions">
          {onEdit && (
            <button type="button" className="btn btn-sm" onClick={() => onEdit(item)}>
              編集
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="btn btn-sm btn-danger"
              onClick={() => {
                if (window.confirm(`「${item.title}」を削除しますか？`)) onDelete(item.id)
              }}
            >
              削除
            </button>
          )}
          {onMove &&
            moveTargets.map((t) => (
              <button
                key={t.column}
                type="button"
                className="btn btn-sm btn-move"
                onClick={() => onMove(item.id, t.column)}
              >
                {t.label}
              </button>
            ))}
        </div>
      )}
    </article>
  )
}
