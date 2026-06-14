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

export type LifePatternDimensionMeta = {
  label: string
  emoji: string
}

export const LIFE_PATTERN_DIMENSION_META: Record<LifePatternDimension, LifePatternDimensionMeta> = {
  meditation: { label: 'Meditation', emoji: '🧘' },
  walk: { label: 'Walk', emoji: '🚶' },
  work: { label: 'Work', emoji: '💼' },
  spend: { label: 'Spending', emoji: '💸' },
  study: { label: 'Study', emoji: '📚' },
  expression: { label: 'Expression', emoji: '🎤' },
  relax: { label: 'Relax', emoji: '🌿' },
  enjoy: { label: 'Enjoyment', emoji: '🎉' },
  entertainment: { label: 'Entertainment', emoji: '🎮' },
}
