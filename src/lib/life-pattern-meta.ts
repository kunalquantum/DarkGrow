import type { LifePatternDimension, LifePatternType } from './types'

export type LifePatternMeta = {
  label: string
  description: string
  emoji: string
  color: string
}

export const LIFE_PATTERN_META: Record<LifePatternType, LifePatternMeta> = {
  ideal: {
    label: 'Ideal',
    description: 'Balanced and intentional — meditation, movement, focused work, and rest.',
    emoji: '✨',
    color: '#34d399',
  },
  busy: {
    label: 'Busy',
    description: 'Heads-down day — extra work, little rest or expression.',
    emoji: '⚡',
    color: '#fbbf24',
  },
  lazy: {
    label: 'Lazy',
    description: 'Low structure — more entertainment, less movement and focus.',
    emoji: '🛋️',
    color: '#a78bfa',
  },
}

export type LifePatternUnit = 'minutes' | 'hours' | 'currency'

export type LifePatternDimensionMeta = {
  label: string
  emoji: string
  unit: LifePatternUnit
  /** Slider upper bound, in the dimension's unit. */
  max: number
  /** Slider increment, in the dimension's unit. */
  step: number
}

export const LIFE_PATTERN_DIMENSION_META: Record<LifePatternDimension, LifePatternDimensionMeta> = {
  meditation: { label: 'Meditation', emoji: '🧘', unit: 'minutes', max: 60, step: 5 },
  walk: { label: 'Walk', emoji: '🚶', unit: 'minutes', max: 120, step: 5 },
  work: { label: 'Work', emoji: '💼', unit: 'hours', max: 12, step: 0.5 },
  spend: { label: 'Spending', emoji: '💸', unit: 'currency', max: 1000, step: 10 },
  study: { label: 'Study', emoji: '📚', unit: 'hours', max: 8, step: 0.5 },
  expression: { label: 'Expression', emoji: '🎤', unit: 'minutes', max: 60, step: 5 },
  relax: { label: 'Relax', emoji: '🌿', unit: 'hours', max: 6, step: 0.5 },
  enjoy: { label: 'Enjoyment', emoji: '🎉', unit: 'hours', max: 6, step: 0.5 },
  entertainment: { label: 'Entertainment', emoji: '🎮', unit: 'hours', max: 6, step: 0.5 },
}

/** Render a dimension's raw value (minutes, hours, or currency) as a human-friendly label. */
export function formatDimensionValue(dimension: LifePatternDimension, value: number): string {
  const { unit } = LIFE_PATTERN_DIMENSION_META[dimension]

  switch (unit) {
    case 'minutes':
      return `${Math.round(value)} min`
    case 'currency':
      return `₹${Math.round(value)}`
    case 'hours': {
      const hours = Math.floor(value)
      const minutes = Math.round((value - hours) * 60)
      if (hours === 0) return `${minutes} min`
      if (minutes === 0) return `${hours} hr${hours === 1 ? '' : 's'}`
      return `${hours}h ${minutes}m`
    }
  }
}

/** Convert a dimension's value to hours, for totalling time across dimensions. 0 for non-time units. */
export function dimensionHours(dimension: LifePatternDimension, value: number): number {
  const { unit } = LIFE_PATTERN_DIMENSION_META[dimension]

  switch (unit) {
    case 'hours':
      return value
    case 'minutes':
      return value / 60
    case 'currency':
      return 0
  }
}
