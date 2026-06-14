import { useLifeOsStore } from '@/store/lifeOsStore'
import { relativeTime } from '@/lib/format'

export function ActivityLog({ objectId }: { objectId: string }) {
  const activityHistory = useLifeOsStore((s) => s.activityHistory)
  const entries = activityHistory.filter((entry) => entry.object_id === objectId)

  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">No history yet.</p>
  }

  return (
    <div className="flex flex-col gap-2">
      {entries.map((entry) => (
        <div key={entry.id} className="flex items-center justify-between gap-3 text-sm">
          <span className="truncate">{entry.description}</span>
          <span className="shrink-0 text-xs text-muted-foreground">{relativeTime(entry.created_at)}</span>
        </div>
      ))}
    </div>
  )
}
