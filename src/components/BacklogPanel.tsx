import { useState } from 'react'
import type { BacklogItem } from '../types'
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
  onMoveToTodo: (id: string) => void
}

export function BacklogPanel({
  items,
  onAdd,
  onUpdate,
  onDelete,
  onMoveToTodo,
}: BacklogPanelProps) {
  const [editing, setEditing] = useState<BacklogItem | null>(null)

  return (
    <section className="panel backlog-panel">
      <header className="panel-header">
        <h2>バックログ</h2>
        <span className="count">{items.length} 件</span>
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

      <div className="item-list">
        {items.length === 0 && <p className="empty">バックログは空です</p>}
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onEdit={setEditing}
            onDelete={onDelete}
            onMove={(_id, _col) => onMoveToTodo(item.id)}
            moveTargets={[{ column: 'todo', label: '→ Todo' }]}
          />
        ))}
      </div>
    </section>
  )
}
