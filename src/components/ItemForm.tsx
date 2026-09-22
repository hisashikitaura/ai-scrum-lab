import { useEffect, useState, type FormEvent } from 'react'
import type { BacklogItem } from '../types'

export interface ItemDraft {
  title: string
  description: string
  points: string
}

interface ItemFormProps {
  initial?: Pick<BacklogItem, 'title' | 'description' | 'points'> | null
  submitLabel: string
  onSubmit: (draft: { title: string; description?: string; points?: number }) => void
  onCancel?: () => void
}

const empty: ItemDraft = { title: '', description: '', points: '' }

export function ItemForm({ initial, submitLabel, onSubmit, onCancel }: ItemFormProps) {
  const [draft, setDraft] = useState<ItemDraft>(empty)

  useEffect(() => {
    if (initial) {
      setDraft({
        title: initial.title,
        description: initial.description ?? '',
        points: initial.points != null ? String(initial.points) : '',
      })
    } else {
      setDraft(empty)
    }
  }, [initial])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const title = draft.title.trim()
    if (!title) return
    const description = draft.description.trim()
    const pointsRaw = draft.points.trim()
    const points = pointsRaw === '' ? undefined : Number(pointsRaw)
    if (pointsRaw !== '' && (Number.isNaN(points) || points! < 0)) return
    onSubmit({
      title,
      description: description || undefined,
      points,
    })
    if (!initial) setDraft(empty)
  }

  return (
    <form className="item-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="item-title">タイトル</label>
        <input
          id="item-title"
          type="text"
          value={draft.title}
          onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          placeholder="例: ログイン画面の実装"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="item-desc">説明（任意）</label>
        <textarea
          id="item-desc"
          value={draft.description}
          onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
          placeholder="受け入れ条件やメモ"
          rows={2}
        />
      </div>
      <div className="field field-inline">
        <label htmlFor="item-points">ポイント（任意）</label>
        <input
          id="item-points"
          type="number"
          min={0}
          step={1}
          value={draft.points}
          onChange={(e) => setDraft((d) => ({ ...d, points: e.target.value }))}
          placeholder="例: 3"
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            キャンセル
          </button>
        )}
      </div>
    </form>
  )
}
