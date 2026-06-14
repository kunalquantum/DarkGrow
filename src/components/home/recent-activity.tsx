import { History } from 'lucide-react'
import { useLifeOsStore } from '@/store/lifeOsStore'
import { TYPE_META } from '@/lib/life-object-meta'
import { relativeTime } from '@/lib/format'

export function RecentActivity() {
  const activityHistory = useLifeOsStore((s) => s.activityHistory)
  const lifeObjects = useLifeOsStore((s) => s.lifeObjects)
  const recent = activityHistory.slice(0, 8)

  if (recent.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
        No activity yet.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {recent.map((entry) => {
        const object = lifeObjects.find((o) => o.id === entry.object_id)
        const meta = object ? TYPE_META[object.type] : null
        const Icon = meta?.icon ?? History

        return (
          <div key={entry.id} className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
            <div className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted ${meta?.color ?? 'text-muted-foreground'}`}>
              <Icon className="size-3.5" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm">{entry.description}</p>
              <p className="text-xs text-muted-foreground">{relativeTime(entry.created_at)}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
