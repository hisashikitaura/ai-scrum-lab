import type { BacklogItem } from './types'

export function sumPoints(items: BacklogItem[]): number {
  return items.reduce((sum, item) => sum + (item.points ?? 0), 0)
}

export function formatPoints(n: number): string {
  return `${n}pt`
}
