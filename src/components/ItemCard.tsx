import type { BacklogItem, ColumnId } from '../types'

interface ItemCardProps {
  item: BacklogItem
  onEdit?: (item: BacklogItem) => void
  onDelete?: (id: string) => void
  onMove?: (id: string, column: ColumnId) => void
  moveTargets?: { column: ColumnId; label: string }[]
  showActions?: boolean
}

export function ItemCard({
  item,
  onEdit,
  onDelete,
  onMove,
  moveTargets = [],
  showActions = true,
}: ItemCardProps) {
  return (
    <article className="item-card">
      <div className="item-card-header">
        <h3 className="item-title">{item.title}</h3>
        {item.points != null && <span className="badge points">{item.points}pt</span>}
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
