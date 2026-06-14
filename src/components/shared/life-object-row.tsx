import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { TYPE_META, STATUS_META } from '@/lib/life-object-meta'
import { relativeTime } from '@/lib/format'
import type { LifeObject } from '@/lib/types'

export function LifeObjectRow({ object }: { object: LifeObject }) {
  const type = TYPE_META[object.type]
  const status = STATUS_META[object.status]
  const TypeIcon = type.icon
  const StatusIcon = status.icon
  const accentBg = type.color.replace('text-', 'bg-')

  return (
    <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.99 }}>
      <Link
        to={`/object/${object.id}`}
        className="relative flex items-center gap-3 overflow-hidden rounded-lg border border-border bg-card p-3 pl-4 transition-colors hover:border-accent/40"
      >
        <span className={`absolute inset-y-0 left-0 w-1 ${accentBg}`} />
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
    </motion.div>
  )
}
