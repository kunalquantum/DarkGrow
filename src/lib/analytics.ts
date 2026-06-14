// Life OS Analytics Engine
// Pure, deterministic calculations over Life Objects, relationships and
// activity history. No AI / LLM calls - everything is computed locally.

import type {
  ActivityHistoryEntry,
  LifeObject,
  LifeObjectRelationship,
} from "@/lib/types/database";

const OPEN_STATUSES = new Set(["new", "active", "paused"]);
const DAY_MS = 1000 * 60 * 60 * 24;

export interface TopicCount {
  tag: string;
  count: number;
}

export interface ProductiveDay {
  day: string;
  count: number;
}

export interface InsightsSummary {
  totalObjects: number;
  projectsStarted: number;
  projectsCompleted: number;
  ideasCaptured: number;
  goalsAchieved: number;
  completionRate: number; // 0-100
  openLoopCount: number;
  averageCompletionDays: number | null;
  ideaConversionRate: number; // 0-100
  projectSuccessRate: number; // 0-100
  mostActiveTopics: TopicCount[];
  mostProductiveDays: ProductiveDay[];
  lifeMomentum: number; // activity events in last 7 days
  lifeMomentumPrevious: number; // activity events in the 7 days before that
}

export function completionRate(objects: LifeObject[]): number {
  if (objects.length === 0) return 0;
  const completed = objects.filter((o) => o.status === "completed").length;
  return round((completed / objects.length) * 100);
}

export function openLoops(objects: LifeObject[]): LifeObject[] {
  return objects
    .filter((o) => OPEN_STATUSES.has(o.status))
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
}

export function averageCompletionDays(objects: LifeObject[]): number | null {
  const durations: number[] = [];
  for (const obj of objects) {
    if (obj.status !== "completed" || !obj.completed_date) continue;
    const start = obj.start_date ?? obj.created_at;
    const startTime = new Date(start).getTime();
    const endTime = new Date(obj.completed_date).getTime();
    if (Number.isNaN(startTime) || Number.isNaN(endTime)) continue;
    const days = (endTime - startTime) / DAY_MS;
    if (days >= 0) durations.push(days);
  }
  if (durations.length === 0) return null;
  const total = durations.reduce((sum, d) => sum + d, 0);
  return round(total / durations.length);
}

export function ideaConversionRate(
  objects: LifeObject[],
  relationships: LifeObjectRelationship[]
): number {
  const ideas = objects.filter((o) => o.type === "idea");
  if (ideas.length === 0) return 0;

  const ideaIds = new Set(ideas.map((i) => i.id));
  const convertedIdeaIds = new Set<string>();

  for (const rel of relationships) {
    if (rel.relationship_type !== "created_from" && rel.relationship_type !== "resulted_in") {
      continue;
    }
    // created_from: project --created_from--> idea
    if (rel.relationship_type === "created_from" && ideaIds.has(rel.to_object_id)) {
      convertedIdeaIds.add(rel.to_object_id);
    }
    // resulted_in: idea --resulted_in--> project
    if (rel.relationship_type === "resulted_in" && ideaIds.has(rel.from_object_id)) {
      convertedIdeaIds.add(rel.from_object_id);
    }
  }

  return round((convertedIdeaIds.size / ideas.length) * 100);
}

export function projectSuccessRate(objects: LifeObject[]): number {
  const projects = objects.filter((o) => o.type === "project");
  if (projects.length === 0) return 0;
  const completed = projects.filter((o) => o.status === "completed").length;
  return round((completed / projects.length) * 100);
}

export function mostActiveTopics(objects: LifeObject[], limit = 8): TopicCount[] {
  const counts = new Map<string, number>();
  for (const obj of objects) {
    for (const tag of obj.tags ?? []) {
      const key = tag.trim().toLowerCase();
      if (!key) continue;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function mostProductiveDays(history: ActivityHistoryEntry[], limit = 3): ProductiveDay[] {
  const counts = new Map<string, number>();
  for (const entry of history) {
    if (entry.action !== "completed" && entry.action !== "progress_updated") continue;
    const day = WEEKDAY_NAMES[new Date(entry.created_at).getDay()];
    counts.set(day, (counts.get(day) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([day, count]) => ({ day, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function lifeMomentum(history: ActivityHistoryEntry[]): { current: number; previous: number } {
  const now = Date.now();
  const sevenDaysAgo = now - 7 * DAY_MS;
  const fourteenDaysAgo = now - 14 * DAY_MS;

  let current = 0;
  let previous = 0;

  for (const entry of history) {
    const time = new Date(entry.created_at).getTime();
    if (time >= sevenDaysAgo) {
      current += 1;
    } else if (time >= fourteenDaysAgo && time < sevenDaysAgo) {
      previous += 1;
    }
  }

  return { current, previous };
}

export function buildInsightsSummary(
  objects: LifeObject[],
  relationships: LifeObjectRelationship[],
  history: ActivityHistoryEntry[]
): InsightsSummary {
  const projects = objects.filter((o) => o.type === "project");
  const ideas = objects.filter((o) => o.type === "idea");
  const goals = objects.filter((o) => o.type === "goal");
  const momentum = lifeMomentum(history);

  return {
    totalObjects: objects.length,
    projectsStarted: projects.length,
    projectsCompleted: projects.filter((p) => p.status === "completed").length,
    ideasCaptured: ideas.length,
    goalsAchieved: goals.filter((g) => g.status === "completed").length,
    completionRate: completionRate(objects),
    openLoopCount: openLoops(objects).length,
    averageCompletionDays: averageCompletionDays(objects),
    ideaConversionRate: ideaConversionRate(objects, relationships),
    projectSuccessRate: projectSuccessRate(objects),
    mostActiveTopics: mostActiveTopics(objects),
    mostProductiveDays: mostProductiveDays(history),
    lifeMomentum: momentum.current,
    lifeMomentumPrevious: momentum.previous,
  };
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}
