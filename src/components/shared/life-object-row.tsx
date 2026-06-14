import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { TYPE_META, STATUS_META } from '@/lib/life-object-meta'
import { relativeTime } from '@/lib/format'
import type { LifeObject } from '@/lib/types'

export function LifeObjectRow({ object }: { object: LifeObject }) {
  const type = TYPE_META[object.type]
  const status = STATUS_META[object.status]
  const TypeIcon = type.icon
  const StatusIcon = status.icon

  return (
    <Link
      to={`/object/${object.id}`}
      className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-accent/40"
    >
      <div className={`flex size-9 shrink-0 items-center justify-center rounded-md bg-muted ${type.color}`}>
        <TypeIcon className="size-4" />
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="truncate text-sm font-medium">{object.title}</p>
        <p className="text-xs text-muted-foreground">{relativeTime(object.updated_at)}</p>
      </div>
      <Badge variant="outline" className={status.color}>
        <StatusIcon className="size-3" />
        {status.label}
      </Badge>
    </Link>
  )
}
