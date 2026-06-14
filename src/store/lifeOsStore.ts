import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  ENERGY_CATEGORIES,
  ENERGY_CATEGORY_BUDGET,
  type ActivityHistoryEntry,
  type DailyEnergyLog,
  type DailyReflection,
  type EnergyCategory,
  type LifeObject,
  type LifeObjectRelationship,
  type LifeObjectStatus,
  type LifeObjectType,
  type RelationshipType,
  type ThreadEntry,
} from '@/lib/types'
import { DEFAULT_MOOD } from '@/lib/mood-meta'

function createId(): string {
  return crypto.randomUUID()
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

export type NewLifeObjectInput = {
  type: LifeObjectType
  title: string
  body?: string
  tags?: string[]
  status?: LifeObjectStatus
}

export type UpdateLifeObjectInput = Partial<
  Pick<LifeObject, 'title' | 'body' | 'tags' | 'status' | 'type'>
>

export type NewRelationshipInput = {
  source_id: string
  target_id: string
  relationship_type: RelationshipType
}

function emptyEnergySpent(): Record<EnergyCategory, number> {
  return Object.fromEntries(ENERGY_CATEGORIES.map((category) => [category, 0])) as Record<
    EnergyCategory,
    number
  >
}

type LifeOsState = {
  lifeObjects: LifeObject[]
  relationships: LifeObjectRelationship[]
  activityHistory: ActivityHistoryEntry[]
  dailyReflections: DailyReflection[]
  dailyEnergyLogs: DailyEnergyLog[]
  threadEntries: ThreadEntry[]

  quickCapture: (title: string, type?: LifeObjectType) => LifeObject
  createLifeObject: (input: NewLifeObjectInput) => LifeObject
  updateLifeObject: (id: string, updates: UpdateLifeObjectInput) => void
  deleteLifeObject: (id: string) => void

  createRelationship: (input: NewRelationshipInput) => LifeObjectRelationship
  deleteRelationship: (id: string) => void

  addThreadEntry: (objectId: string, content: string) => ThreadEntry
  deleteThreadEntry: (id: string) => void

  getTodaysReflection: () => DailyReflection | undefined
  saveTodaysReflection: (
    input: Partial<Pick<DailyReflection, 'highlight' | 'lowlight' | 'gratitude' | 'notes' | 'mood' | 'emotions'>>,
  ) => void

  getTodaysEnergy: () => DailyEnergyLog | undefined
  setEnergySpent: (category: EnergyCategory, amount: number) => void
}

function logActivity(
  history: ActivityHistoryEntry[],
  objectId: string,
  action: ActivityHistoryEntry['action'],
  description: string,
): ActivityHistoryEntry[] {
  const entry: ActivityHistoryEntry = {
    id: createId(),
    object_id: objectId,
    action,
    description,
    created_at: new Date().toISOString(),
  }
  return [entry, ...history]
}

export const useLifeOsStore = create<LifeOsState>()(
  persist(
    (set, get) => ({
      lifeObjects: [],
      relationships: [],
      activityHistory: [],
      dailyReflections: [],
      dailyEnergyLogs: [],
      threadEntries: [],

      quickCapture: (title, type = 'note') => {
        return get().createLifeObject({ type, title })
      },

      createLifeObject: (input) => {
        const now = new Date().toISOString()
        const object: LifeObject = {
          id: createId(),
          type: input.type,
          status: input.status ?? 'new',
          title: input.title.trim(),
          body: input.body?.trim() ?? '',
          tags: input.tags ?? [],
          created_at: now,
          updated_at: now,
          completed_at: input.status === 'completed' ? now : null,
        }

        set((state) => ({
          lifeObjects: [object, ...state.lifeObjects],
          activityHistory: logActivity(
            state.activityHistory,
            object.id,
            'created',
            `Created "${object.title}"`,
          ),
        }))

        return object
      },

      updateLifeObject: (id, updates) => {
        set((state) => {
          const existing = state.lifeObjects.find((o) => o.id === id)
          if (!existing) return state

          const now = new Date().toISOString()
          const statusChanged = updates.status !== undefined && updates.status !== existing.status

          const updated: LifeObject = {
            ...existing,
            ...updates,
            tags: updates.tags ?? existing.tags,
            updated_at: now,
            completed_at:
              updates.status === 'completed'
                ? existing.completed_at ?? now
                : updates.status !== undefined
                  ? null
                  : existing.completed_at,
          }

          let activityHistory = state.activityHistory
          if (statusChanged) {
            activityHistory = logActivity(
              activityHistory,
              id,
              'status_changed',
              `Status changed from "${existing.status}" to "${updated.status}"`,
            )
          } else {
            activityHistory = logActivity(activityHistory, id, 'updated', `Updated "${updated.title}"`)
          }

          return {
            lifeObjects: state.lifeObjects.map((o) => (o.id === id ? updated : o)),
            activityHistory,
          }
        })
      },

      deleteLifeObject: (id) => {
        set((state) => {
          const existing = state.lifeObjects.find((o) => o.id === id)
          if (!existing) return state

          return {
            lifeObjects: state.lifeObjects.filter((o) => o.id !== id),
            relationships: state.relationships.filter(
              (r) => r.source_id !== id && r.target_id !== id,
            ),
            threadEntries: state.threadEntries.filter((t) => t.object_id !== id),
            activityHistory: logActivity(
              state.activityHistory,
              id,
              'deleted',
              `Deleted "${existing.title}"`,
            ),
          }
        })
      },

      createRelationship: (input) => {
        const relationship: LifeObjectRelationship = {
          id: createId(),
          source_id: input.source_id,
          target_id: input.target_id,
          relationship_type: input.relationship_type,
          created_at: new Date().toISOString(),
        }

        set((state) => {
          const target = state.lifeObjects.find((o) => o.id === input.target_id)
          return {
            relationships: [relationship, ...state.relationships],
            activityHistory: logActivity(
              state.activityHistory,
              input.source_id,
              'relationship_added',
              `Linked to "${target?.title ?? 'another item'}" (${input.relationship_type.replace(/_/g, ' ')})`,
            ),
          }
        })

        return relationship
      },

      deleteRelationship: (id) => {
        set((state) => {
          const existing = state.relationships.find((r) => r.id === id)
          if (!existing) return state

          return {
            relationships: state.relationships.filter((r) => r.id !== id),
            activityHistory: logActivity(
              state.activityHistory,
              existing.source_id,
              'relationship_removed',
              `Removed link (${existing.relationship_type.replace(/_/g, ' ')})`,
            ),
          }
        })
      },

      addThreadEntry: (objectId, content) => {
        const entry: ThreadEntry = {
          id: createId(),
          object_id: objectId,
          content: content.trim(),
          created_at: new Date().toISOString(),
        }

        set((state) => ({
          threadEntries: [entry, ...state.threadEntries],
          activityHistory: logActivity(state.activityHistory, objectId, 'note_added', 'Added a thread update'),
        }))

        return entry
      },

      deleteThreadEntry: (id) => {
        set((state) => ({
          threadEntries: state.threadEntries.filter((entry) => entry.id !== id),
        }))
      },

      getTodaysReflection: () => {
        return get().dailyReflections.find((r) => r.date === todayKey())
      },

      saveTodaysReflection: (input) => {
        set((state) => {
          const now = new Date().toISOString()
          const date = todayKey()
          const existing = state.dailyReflections.find((r) => r.date === date)

          if (existing) {
            const updated: DailyReflection = { ...existing, ...input, updated_at: now }
            return {
              dailyReflections: state.dailyReflections.map((r) => (r.date === date ? updated : r)),
            }
          }

          const created: DailyReflection = {
            id: createId(),
            date,
            mood: input.mood ?? DEFAULT_MOOD,
            emotions: input.emotions ?? [],
            highlight: input.highlight ?? '',
            lowlight: input.lowlight ?? '',
            gratitude: input.gratitude ?? '',
            notes: input.notes ?? '',
            created_at: now,
            updated_at: now,
          }

          return { dailyReflections: [created, ...state.dailyReflections] }
        })
      },

      getTodaysEnergy: () => {
        return get().dailyEnergyLogs.find((log) => log.date === todayKey())
      },

      setEnergySpent: (category, amount) => {
        set((state) => {
          const now = new Date().toISOString()
          const date = todayKey()
          const clamped = Math.min(ENERGY_CATEGORY_BUDGET, Math.max(0, Math.round(amount)))
          const existing = state.dailyEnergyLogs.find((log) => log.date === date)

          if (existing) {
            const updated: DailyEnergyLog = {
              ...existing,
              spent: { ...existing.spent, [category]: clamped },
              updated_at: now,
            }
            return {
              dailyEnergyLogs: state.dailyEnergyLogs.map((log) => (log.date === date ? updated : log)),
            }
          }

          const created: DailyEnergyLog = {
            id: createId(),
            date,
            spent: { ...emptyEnergySpent(), [category]: clamped },
            created_at: now,
            updated_at: now,
          }

          return { dailyEnergyLogs: [created, ...state.dailyEnergyLogs] }
        })
      },
    }),
    { name: 'life-os-storage' },
  ),
)

export function searchLifeObjects(objects: LifeObject[], query: string): LifeObject[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return []

  return objects.filter((object) => {
    if (object.title.toLowerCase().includes(normalized)) return true
    if (object.body.toLowerCase().includes(normalized)) return true
    return object.tags.some((tag) => tag.toLowerCase().includes(normalized))
  })
}
