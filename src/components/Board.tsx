import type { BacklogItem, ColumnId } from '../types'
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

interface BoardProps {
  items: BacklogItem[]
  onMove: (id: string, column: ColumnId) => void
}

export function Board({ items, onMove }: BoardProps) {
  return (
    <section className="board">
      <header className="panel-header">
        <h2>ボード</h2>
      </header>
      <div className="board-columns">
        {COLUMNS.map((col) => {
          const colItems = items.filter((i) => i.column === col.id)
          return (
            <div key={col.id} className={`column column-${col.id}`}>
              <div className="column-header">
                <h3>{col.label}</h3>
                <span className="count">{colItems.length}</span>
              </div>
              <div className="column-body">
                {colItems.length === 0 && <p className="empty">なし</p>}
                {colItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onMove={onMove}
                    moveTargets={moveTargetsFor(col.id)}
                    showActions
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
