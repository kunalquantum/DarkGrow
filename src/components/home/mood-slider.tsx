import { AnimatePresence, motion } from 'framer-motion'
import { Slider } from '@/components/ui/slider'
import { MOOD_SCALE, moodForValue } from '@/lib/mood-meta'

export function MoodSlider({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const mood = moodForValue(value)

  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-4">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={mood.value}
          initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className="text-6xl leading-none"
        >
          {mood.emoji}
        </motion.span>
      </AnimatePresence>

      <p className="text-sm font-semibold" style={{ color: mood.color }}>
        {mood.label}
      </p>

      <Slider
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ accentColor: mood.color }}
        aria-label="Mood"
        className="w-full"
      />

      <div className="flex w-full justify-between px-0.5 text-lg">
        {MOOD_SCALE.map((level) => (
          <button
            key={level.value}
            type="button"
            onClick={() => onChange(level.value)}
            className={`transition-opacity ${level.value === value ? 'opacity-100' : 'opacity-30 hover:opacity-60'}`}
            aria-label={level.label}
          >
            {level.emoji}
          </button>
        ))}
      </div>
    </div>
  )
}
