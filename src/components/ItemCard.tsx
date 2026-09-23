import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useState, type FormEvent, type KeyboardEvent } from 'react'
import {
  acceptanceSummary,
  type AcceptanceCriterion,
  type BacklogItem,
  type ColumnId,
} from '../types'

interface ItemCardProps {
  item: BacklogItem
  onEdit?: (item: BacklogItem) => void
  onDelete?: (id: string) => void
  onMove?: (id: string, column: ColumnId) => void
  onPointsChange?: (id: string, points: number | undefined) => void
  onAddCriterion?: (itemId: string, text: string) => void
  onToggleCriterion?: (itemId: string, criterionId: string) => void
  onRemoveCriterion?: (itemId: string, criterionId: string) => void
  moveTargets?: { column: ColumnId; label: string }[]
  showActions?: boolean
  draggable?: boolean
  /** DragOverlay などではチェックリスト編集を出さない */
  showAcceptance?: boolean
}

export function ItemCard({
  item,
  onEdit,
  onDelete,
  onMove,
  onPointsChange,
  onAddCriterion,
  onToggleCriterion,
  onRemoveCriterion,
  moveTargets = [],
  showActions = true,
  draggable = false,
  showAcceptance = true,
}: ItemCardProps) {
  const [draft, setDraft] = useState('')
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

  const criteria = item.acceptanceCriteria ?? []
  const { total, done } = acceptanceSummary(item)
  const canEditAc = Boolean(
    showAcceptance && (onAddCriterion || onToggleCriterion || onRemoveCriterion),
  )

  function submitCriterion(e?: FormEvent) {
    e?.preventDefault()
    const text = draft.trim()
    if (!text || !onAddCriterion) return
    onAddCriterion(item.id, text)
    setDraft('')
  }

  function onDraftKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      submitCriterion()
    }
  }

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

      {canEditAc && (
        <div className="ac-block">
          <div className="ac-header">
            <span className="ac-label">受け入れ条件</span>
            {total > 0 && (
              <span
                className={`ac-progress${done === total ? ' ac-progress-done' : ''}`}
                title="完了 / 全件数"
              >
                {done}/{total}
              </span>
            )}
          </div>
          {criteria.length > 0 && (
            <ul className="ac-list">
              {criteria.map((c: AcceptanceCriterion) => (
                <li key={c.id} className={`ac-item${c.done ? ' ac-item-done' : ''}`}>
                  <label className="ac-check">
                    <input
                      type="checkbox"
                      checked={c.done}
                      disabled={!onToggleCriterion}
                      onChange={() => onToggleCriterion?.(item.id, c.id)}
                    />
                    <span>{c.text}</span>
                  </label>
                  {onRemoveCriterion && (
                    <button
                      type="button"
                      className="btn btn-sm btn-ghost ac-remove"
                      aria-label="受け入れ条件を削除"
                      title="削除"
                      onClick={() => onRemoveCriterion(item.id, c.id)}
                    >
                      ×
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
          {onAddCriterion && (
            <div className="ac-add-row">
              <input
                type="text"
                className="ac-add-input"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onDraftKey}
                placeholder="条件を追加…"
                aria-label="受け入れ条件を追加"
              />
              <button
                type="button"
                className="btn btn-sm"
                disabled={!draft.trim()}
                onClick={() => submitCriterion()}
              >
                追加
              </button>
            </div>
          )}
        </div>
      )}

      {!canEditAc && showAcceptance && total > 0 && (
        <p className="ac-summary-muted">
          受け入れ条件 {done}/{total}
        </p>
      )}

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
