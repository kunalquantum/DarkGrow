import {
  Lightbulb,
  Rocket,
  Target,
  BookOpen,
  GitBranch,
  Sparkles,
  Trophy,
  Calendar,
  Repeat,
  StickyNote,
  type LucideIcon,
} from "lucide-react";
import type { LifeObjectStatus, LifeObjectType } from "@/lib/types/database";

export const TYPE_META: Record<LifeObjectType, { label: string; icon: LucideIcon }> = {
  idea: { label: "Idea", icon: Lightbulb },
  project: { label: "Project", icon: Rocket },
  goal: { label: "Goal", icon: Target },
  learning: { label: "Learning", icon: BookOpen },
  decision: { label: "Decision", icon: GitBranch },
  reflection: { label: "Reflection", icon: Sparkles },
  achievement: { label: "Achievement", icon: Trophy },
  event: { label: "Event", icon: Calendar },
  habit: { label: "Habit", icon: Repeat },
  note: { label: "Note", icon: StickyNote },
};

export const STATUS_META: Record<LifeObjectStatus, { label: string; className: string }> = {
  new: { label: "New", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  active: { label: "Active", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  paused: { label: "Paused", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  completed: { label: "Completed", className: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
  cancelled: { label: "Cancelled", className: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  archived: { label: "Archived", className: "bg-zinc-500/10 text-zinc-500 dark:text-zinc-400" },
};

export function typeLabel(type: LifeObjectType): string {
  return TYPE_META[type]?.label ?? type;
}

export function statusLabel(status: LifeObjectStatus): string {
  return STATUS_META[status]?.label ?? status;
}
