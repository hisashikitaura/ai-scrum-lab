import { useDroppable } from '@dnd-kit/core'
import { useState } from 'react'
import type { BacklogItem, ColumnId } from '../types'
import { formatPoints, sumPoints } from '../points'
import { ItemCard } from './ItemCard'
import { ItemForm } from './ItemForm'

interface BacklogPanelProps {
  items: BacklogItem[]
  onAdd: (data: { title: string; description?: string; points?: number }) => void
  onUpdate: (
    id: string,
    data: { title: string; description?: string; points?: number },
  ) => void
  onDelete: (id: string) => void
  onMove: (id: string, column: ColumnId) => void
  onPointsChange: (id: string, points: number | undefined) => void
}

export function BacklogPanel({
  items,
  onAdd,
  onUpdate,
  onDelete,
  onMove,
  onPointsChange,
}: BacklogPanelProps) {
  const [editing, setEditing] = useState<BacklogItem | null>(null)
  const { setNodeRef, isOver } = useDroppable({ id: 'backlog' })
  const total = sumPoints(items)

  return (
    <section className="panel backlog-panel">
      <header className="panel-header">
        <h2>バックログ</h2>
        <div className="totals-row">
          <span className="count">{items.length} 件</span>
          <span className="points-total points-total-lg" title="バックログ合計">
            合計 {formatPoints(total)}
          </span>
        </div>
      </header>

      {editing ? (
        <div className="edit-box">
          <h3>アイテムを編集</h3>
          <ItemForm
            initial={editing}
            submitLabel="更新"
            onSubmit={(data) => {
              onUpdate(editing.id, data)
              setEditing(null)
            }}
            onCancel={() => setEditing(null)}
          />
        </div>
      ) : (
        <div className="add-box">
          <h3>新規追加</h3>
          <ItemForm submitLabel="追加" onSubmit={onAdd} />
        </div>
      )}

      <div
        ref={setNodeRef}
        className={`item-list${isOver ? ' drop-over' : ''}`}
      >
        {items.length === 0 && <p className="empty">バックログは空です</p>}
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onEdit={setEditing}
            onDelete={onDelete}
            onMove={onMove}
            onPointsChange={onPointsChange}
            moveTargets={[{ column: 'todo', label: '→ Todo' }]}
            draggable
          />
        ))}
      </div>
    </section>
  )
}
