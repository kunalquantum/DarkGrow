import { motion } from 'framer-motion'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import {
  LIFE_PATTERNS,
  LIFE_PATTERN_DIMENSIONS,
  type LifePatternDimension,
  type LifePatternType,
} from '@/lib/types'
import { LIFE_PATTERN_META, LIFE_PATTERN_DIMENSION_META } from '@/lib/life-pattern-meta'

export function LifePattern({
  pattern,
  onPatternChange,
  scores,
  onScoreChange,
}: {
  pattern: LifePatternType
  onPatternChange: (pattern: LifePatternType) => void
  scores: Partial<Record<LifePatternDimension, number>>
  onScoreChange: (dimension: LifePatternDimension, value: number) => void
}) {
  const dimensions = LIFE_PATTERN_DIMENSIONS[pattern]
  const meta = LIFE_PATTERN_META[pattern]

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2">
        {LIFE_PATTERNS.map((type) => {
          const typeMeta = LIFE_PATTERN_META[type]
          const active = type === pattern

          return (
            <motion.button
              key={type}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => onPatternChange(type)}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg border px-2 py-2.5 text-xs font-medium transition-colors',
                active
                  ? 'border-accent/40 bg-accent/10 text-accent'
                  : 'border-border bg-muted text-muted-foreground hover:text-foreground',
              )}
            >
              <span className="text-lg">{typeMeta.emoji}</span>
              {typeMeta.label}
            </motion.button>
          )
        })}
      </div>

      <p className="text-xs text-muted-foreground">{meta.description}</p>

      <div className="flex flex-col gap-3">
        {dimensions.map((dimension) => {
          const dimensionMeta = LIFE_PATTERN_DIMENSION_META[dimension]
          const value = scores[dimension] ?? 0

          return (
            <div key={dimension} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span>{dimensionMeta.emoji}</span>
                  {dimensionMeta.label}
                </span>
                <span className="text-muted-foreground">{value} / 10</span>
              </div>
              <Slider
                min={0}
                max={10}
                step={1}
                value={value}
                onChange={(e) => onScoreChange(dimension, Number(e.target.value))}
                style={{ accentColor: meta.color }}
                aria-label={dimensionMeta.label}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
