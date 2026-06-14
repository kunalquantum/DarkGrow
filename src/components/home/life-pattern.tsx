import { motion } from 'framer-motion'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import {
  LIFE_PATTERNS,
  LIFE_PATTERN_DIMENSIONS,
  type LifePatternDimension,
  type LifePatternType,
} from '@/lib/types'
import {
  LIFE_PATTERN_META,
  LIFE_PATTERN_DIMENSION_META,
  formatDimensionValue,
  dimensionHours,
} from '@/lib/life-pattern-meta'

const HOURS_IN_DAY = 24

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

  const totalHours = dimensions.reduce((sum, dimension) => sum + dimensionHours(dimension, scores[dimension] ?? 0), 0)

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
                <span className="text-muted-foreground">{formatDimensionValue(dimension, value)}</span>
              </div>
              <Slider
                min={0}
                max={dimensionMeta.max}
                step={dimensionMeta.step}
                value={value}
                onChange={(e) => onScoreChange(dimension, Number(e.target.value))}
                style={{ accentColor: meta.color }}
                aria-label={dimensionMeta.label}
              />
            </div>
          )
        })}
      </div>

      <div className="flex flex-col gap-1.5 border-t border-border pt-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Time tracked today</span>
          <span className="text-muted-foreground">
            {totalHours.toFixed(1)} / {HOURS_IN_DAY} hrs
          </span>
        </div>
        <Progress value={Math.min(100, (totalHours / HOURS_IN_DAY) * 100)} />
      </div>
    </div>
  )
}
