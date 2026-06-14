import { motion } from 'framer-motion'
import { EMOTION_TAGS } from '@/lib/mood-meta'
import { cn } from '@/lib/utils'

export function EmotionTags({ value, onToggle }: { value: string[]; onToggle: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {EMOTION_TAGS.map((emotion) => {
        const active = value.includes(emotion.id)

        return (
          <motion.button
            key={emotion.id}
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => onToggle(emotion.id)}
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              active
                ? 'border-accent/40 bg-accent/15 text-accent'
                : 'border-border bg-muted text-muted-foreground hover:text-foreground',
            )}
          >
            <span className="text-sm">{emotion.emoji}</span>
            {emotion.label}
          </motion.button>
        )
      })}
    </div>
  )
}
