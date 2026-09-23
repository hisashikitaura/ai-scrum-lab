import type { BacklogItem } from './types'

export function sumPoints(items: BacklogItem[]): number {
  return items.reduce((sum, item) => sum + (item.points ?? 0), 0)
}

export function formatPoints(n: number): string {
  return `${n}pt`
}

/** 未完了（Todo + Doing）の残ポイント */
export function remainingPoints(items: BacklogItem[]): number {
  return sumPoints(
    items.filter((i) => i.column === 'todo' || i.column === 'doing'),
  )
}

/** ボード上（バックログ以外）の合計 */
export function boardPoints(items: BacklogItem[]): number {
  return sumPoints(items.filter((i) => i.column !== 'backlog'))
}

export function donePoints(items: BacklogItem[]): number {
  return sumPoints(items.filter((i) => i.column === 'done'))
}

export function averageVelocity(completed: number[]): number {
  if (completed.length === 0) return 0
  const sum = completed.reduce((a, b) => a + b, 0)
  return Math.round((sum / completed.length) * 10) / 10
}
