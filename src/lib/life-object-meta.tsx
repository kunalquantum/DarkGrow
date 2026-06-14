import {
  Archive,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Circle,
  FolderKanban,
  GitFork,
  Lightbulb,
  type LucideIcon,
  PauseCircle,
  PlayCircle,
  Repeat,
  Sparkles,
  StickyNote,
  Target,
  Trophy,
  XCircle,
} from 'lucide-react'
import type { LifeObjectStatus, LifeObjectType } from './types'

type TypeMeta = {
  label: string
  icon: LucideIcon
  color: string
}

type StatusMeta = {
  label: string
  icon: LucideIcon
  color: string
}

export const TYPE_META: Record<LifeObjectType, TypeMeta> = {
  idea: { label: 'Idea', icon: Lightbulb, color: 'text-amber-400' },
  project: { label: 'Project', icon: FolderKanban, color: 'text-sky-400' },
  goal: { label: 'Goal', icon: Target, color: 'text-rose-400' },
  learning: { label: 'Learning', icon: BookOpen, color: 'text-emerald-400' },
  decision: { label: 'Decision', icon: GitFork, color: 'text-violet-400' },
  reflection: { label: 'Reflection', icon: Sparkles, color: 'text-fuchsia-400' },
  achievement: { label: 'Achievement', icon: Trophy, color: 'text-yellow-400' },
  event: { label: 'Event', icon: CalendarDays, color: 'text-cyan-400' },
  habit: { label: 'Habit', icon: Repeat, color: 'text-lime-400' },
  note: { label: 'Note', icon: StickyNote, color: 'text-slate-400' },
}

export const STATUS_META: Record<LifeObjectStatus, StatusMeta> = {
  new: { label: 'New', icon: Circle, color: 'text-muted-foreground' },
  active: { label: 'Active', icon: PlayCircle, color: 'text-success' },
  paused: { label: 'Paused', icon: PauseCircle, color: 'text-warning' },
  completed: { label: 'Completed', icon: CheckCircle2, color: 'text-success' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-danger' },
  archived: { label: 'Archived', icon: Archive, color: 'text-muted-foreground' },
}

export function typeLabel(type: LifeObjectType): string {
  return TYPE_META[type].label
}

export function statusLabel(status: LifeObjectStatus): string {
  return STATUS_META[status].label
}
