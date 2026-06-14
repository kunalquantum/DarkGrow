import { relativeTime } from "@/lib/format";
import type { ActivityHistoryEntry } from "@/lib/types/database";

const ACTION_LABELS: Record<string, string> = {
  created: "Created",
  updated: "Updated",
  status_changed: "Status changed",
  progress_updated: "Progress updated",
  paused: "Paused",
  resumed: "Resumed",
  completed: "Completed",
  cancelled: "Cancelled",
  archived: "Archived",
  relationship_added: "Linked",
  relationship_removed: "Unlinked",
  deleted: "Deleted",
};

export function ActivityLog({ items }: { items: ActivityHistoryEntry[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No history yet.</p>;
  }

  return (
    <ol className="space-y-3 border-l border-border/60 pl-4">
      {items.map((entry) => (
        <li key={entry.id} className="relative text-sm">
          <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-border" />
          <p className="text-foreground/90">{entry.summary ?? ACTION_LABELS[entry.action]}</p>
          <p className="text-xs text-muted-foreground">{relativeTime(entry.created_at)}</p>
        </li>
      ))}
    </ol>
  );
}
