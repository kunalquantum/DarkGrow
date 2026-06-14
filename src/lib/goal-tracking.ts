import { subDays } from 'date-fns'
import { dateKey } from './format'
import type { GoalStepLog, LifeObject } from './types'

/** Goals that are still being worked toward (not finished, cancelled, or archived). */
export function activeGoals(objects: LifeObject[]): LifeObject[] {
  return objects
    .filter((o) => o.type === 'goal' && (o.status === 'new' || o.status === 'active' || o.status === 'paused'))
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
}

export function hasStepOn(logs: GoalStepLog[], goalId: string, date: string): boolean {
  return logs.some((log) => log.goal_id === goalId && log.date === date)
}

/** Consecutive days (ending today or yesterday) with at least one logged step. */
export function goalStreak(logs: GoalStepLog[], goalId: string): number {
  const dates = new Set(logs.filter((log) => log.goal_id === goalId).map((log) => log.date))

  let cursor = new Date()
  if (!dates.has(dateKey(cursor))) {
    cursor = subDays(cursor, 1)
  }

  let streak = 0
  while (dates.has(dateKey(cursor))) {
    streak++
    cursor = subDays(cursor, 1)
  }

  return streak
}

/** Goals that existed yesterday but had no step logged that day — worth a nudge today. */
export function goalsMissedYesterday(goals: LifeObject[], logs: GoalStepLog[]): LifeObject[] {
  const yesterday = dateKey(subDays(new Date(), 1))
  return goals.filter(
    (goal) => goal.created_at.slice(0, 10) <= yesterday && !hasStepOn(logs, goal.id, yesterday),
  )
}
