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

export function RecentActivity({ items }: { items: ActivityHistoryEntry[] }) {
  if (items.length === 0) {
    return (
      <p className="py-2 text-sm text-muted-foreground">
        Your activity will show up here.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((entry) => (
        <li key={entry.id} className="flex items-start gap-3 text-sm">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-foreground/90">
              {entry.summary ?? ACTION_LABELS[entry.action] ?? entry.action}
            </p>
            <p className="text-xs text-muted-foreground">{relativeTime(entry.created_at)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
