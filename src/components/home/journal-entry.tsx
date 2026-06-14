import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, NotebookPen } from 'lucide-react'
import { format } from 'date-fns'
import { useLifeOsStore } from '@/store/lifeOsStore'
import { moodForValue } from '@/lib/mood-meta'

export function JournalEntry() {
  const reflection = useLifeOsStore((s) =>
    s.dailyReflections.find((r) => r.date === new Date().toISOString().slice(0, 10)),
  )
  const mood = reflection ? moodForValue(reflection.mood) : null

  return (
    <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.99 }}>
      <Link
        to="/journal"
        className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent/40"
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-accent">
          <NotebookPen className="size-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">
            {reflection ? "Today's entry" : 'Write in your journal'}
          </p>
          <p className="text-xs text-muted-foreground">
            {reflection
              ? `${mood?.emoji} Felt ${mood?.label.toLowerCase()} · ${format(new Date(), 'MMMM d')}`
              : 'A quiet page for today’s thoughts, mood, and moments.'}
          </p>
        </div>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
      </Link>
    </motion.div>
  )
}
