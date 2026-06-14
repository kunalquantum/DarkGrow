import { differenceInCalendarDays, format } from 'date-fns'
import type { ActivityHistoryEntry, LifeObject, LifeObjectRelationship } from './types'

export type TopicCount = {
  tag: string
  count: number
}

export type ProductiveDay = {
  day: string
  count: number
}

export type InsightsSummary = {
  totalObjects: number
  completionRate: number
  openLoops: LifeObject[]
  averageCompletionDays: number | null
  ideaConversionRate: number
  projectSuccessRate: number
  mostActiveTopics: TopicCount[]
  mostProductiveDays: ProductiveDay[]
  lifeMomentum: number
}

/** Share of started objects (anything past "new") that reached "completed". */
export function completionRate(objects: LifeObject[]): number {
  const started = objects.filter((o) => o.status !== 'new')
  if (started.length === 0) return 0

  const completed = started.filter((o) => o.status === 'completed')
  return completed.length / started.length
}

/** Unfinished objects (new, active, paused), oldest first — things that have been open longest. */
export function openLoops(objects: LifeObject[]): LifeObject[] {
  return objects
    .filter((o) => o.status === 'new' || o.status === 'active' || o.status === 'paused')
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
}

/** Average number of days between creation and completion for completed objects. */
export function averageCompletionDays(objects: LifeObject[]): number | null {
  const completed = objects.filter((o) => o.status === 'completed' && o.completed_at)
  if (completed.length === 0) return null

  const totalDays = completed.reduce((sum, o) => {
    const created = new Date(o.created_at)
    const finished = new Date(o.completed_at as string)
    return sum + Math.max(0, differenceInCalendarDays(finished, created))
  }, 0)

  return totalDays / completed.length
}

/** Share of ideas that went on to become the source of a "created_from" relationship. */
export function ideaConversionRate(
  objects: LifeObject[],
  relationships: LifeObjectRelationship[],
): number {
  const ideas = objects.filter((o) => o.type === 'idea')
  if (ideas.length === 0) return 0

  const convertedIdeaIds = new Set(
    relationships
      .filter((r) => r.relationship_type === 'created_from')
      .map((r) => r.target_id),
  )

  const converted = ideas.filter((idea) => convertedIdeaIds.has(idea.id))
  return converted.length / ideas.length
}

/** Share of projects that finished (completed vs. completed + cancelled). */
export function projectSuccessRate(objects: LifeObject[]): number {
  const projects = objects.filter((o) => o.type === 'project')
  const resolved = projects.filter((o) => o.status === 'completed' || o.status === 'cancelled')
  if (resolved.length === 0) return 0

  const completed = resolved.filter((o) => o.status === 'completed')
  return completed.length / resolved.length
}

/** Most frequently used tags across all objects. */
export function mostActiveTopics(objects: LifeObject[], limit = 5): TopicCount[] {
  const counts = new Map<string, number>()

  for (const object of objects) {
    for (const tag of object.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }

  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

/** Days of the week with the most recorded activity. */
export function mostProductiveDays(activityHistory: ActivityHistoryEntry[], limit = 5): ProductiveDay[] {
  const counts = new Map<string, number>()

  for (const entry of activityHistory) {
    const day = format(new Date(entry.created_at), 'EEEE')
    counts.set(day, (counts.get(day) ?? 0) + 1)
  }

  return Array.from(counts.entries())
    .map(([day, count]) => ({ day, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

/**
 * 0-100 score comparing activity in the last 7 days against the 7 days before that.
 * Steady or growing activity scores higher; quiet weeks score lower.
 */
export function lifeMomentum(activityHistory: ActivityHistoryEntry[]): number {
  const now = Date.now()
  const day = 24 * 60 * 60 * 1000

  let recent = 0
  let previous = 0

  for (const entry of activityHistory) {
    const age = now - new Date(entry.created_at).getTime()
    if (age < 0) continue
    if (age <= 7 * day) recent += 1
    else if (age <= 14 * day) previous += 1
  }

  if (recent === 0 && previous === 0) return 0
  if (previous === 0) return Math.min(100, recent * 10)

  const ratio = recent / previous
  return Math.round(Math.min(100, Math.max(0, ratio * 50)))
}

export function buildInsightsSummary(
  objects: LifeObject[],
  relationships: LifeObjectRelationship[],
  activityHistory: ActivityHistoryEntry[],
): InsightsSummary {
  return {
    totalObjects: objects.length,
    completionRate: completionRate(objects),
    openLoops: openLoops(objects),
    averageCompletionDays: averageCompletionDays(objects),
    ideaConversionRate: ideaConversionRate(objects, relationships),
    projectSuccessRate: projectSuccessRate(objects),
    mostActiveTopics: mostActiveTopics(objects),
    mostProductiveDays: mostProductiveDays(activityHistory),
    lifeMomentum: lifeMomentum(activityHistory),
  }
}
