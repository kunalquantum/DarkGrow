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

/** Contextual prompts to encourage capturing more useful detail per object type. */
export const TYPE_CAPTURE_PROMPTS: Record<LifeObjectType, string> = {
  idea: 'What is the idea, and why does it matter?',
  project: 'What are you building, and what does done look like?',
  goal: 'What does success look like, and by when?',
  learning: 'What did you learn, and how might you use it?',
  decision: 'What are you deciding, and what are the options?',
  reflection: 'What happened, and how did it feel?',
  achievement: 'What did you accomplish, and what made it possible?',
  event: 'What happened, when, and with whom?',
  habit: 'What are you building, and how often?',
  note: 'Anything else worth remembering...',
}

export function typeLabel(type: LifeObjectType): string {
  return TYPE_META[type].label
}

export function statusLabel(status: LifeObjectStatus): string {
  return STATUS_META[status].label
}
