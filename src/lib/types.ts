export const LIFE_OBJECT_TYPES = [
  'idea',
  'project',
  'goal',
  'learning',
  'decision',
  'reflection',
  'achievement',
  'event',
  'habit',
  'note',
] as const

export type LifeObjectType = (typeof LIFE_OBJECT_TYPES)[number]

export const LIFE_OBJECT_STATUSES = [
  'new',
  'active',
  'paused',
  'completed',
  'cancelled',
  'archived',
] as const

export type LifeObjectStatus = (typeof LIFE_OBJECT_STATUSES)[number]

export const RELATIONSHIP_TYPES = [
  'related_to',
  'created_from',
  'supports',
  'depends_on',
  'inspired_by',
  'resulted_in',
] as const

export type RelationshipType = (typeof RELATIONSHIP_TYPES)[number]

export type ActivityAction =
  | 'created'
  | 'updated'
  | 'status_changed'
  | 'relationship_added'
  | 'relationship_removed'
  | 'note_added'
  | 'deleted'

export type LifeObject = {
  id: string
  type: LifeObjectType
  status: LifeObjectStatus
  title: string
  body: string
  tags: string[]
  created_at: string
  updated_at: string
  completed_at: string | null
}

export type LifeObjectRelationship = {
  id: string
  source_id: string
  target_id: string
  relationship_type: RelationshipType
  created_at: string
}

export type ActivityHistoryEntry = {
  id: string
  object_id: string
  action: ActivityAction
  description: string
  created_at: string
}

export type DailyReflection = {
  id: string
  date: string
  highlight: string
  lowlight: string
  gratitude: string
  notes: string
  created_at: string
  updated_at: string
}

export const ENERGY_CATEGORIES = ['mental', 'physical', 'social', 'creative', 'emotional'] as const

export type EnergyCategory = (typeof ENERGY_CATEGORIES)[number]

/** Coins each category can hold per day. */
export const ENERGY_CATEGORY_BUDGET = 20

/** Total daily energy currency, spread across all categories. */
export const DAILY_ENERGY_BUDGET = ENERGY_CATEGORIES.length * ENERGY_CATEGORY_BUDGET

export type DailyEnergyLog = {
  id: string
  date: string
  spent: Record<EnergyCategory, number>
  created_at: string
  updated_at: string
}

/** A single entry in an object's running thread — its own log of thoughts and updates over time. */
export type ThreadEntry = {
  id: string
  object_id: string
  content: string
  created_at: string
}

