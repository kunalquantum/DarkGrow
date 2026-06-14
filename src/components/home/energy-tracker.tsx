import { RadialGauge } from '@/components/ui/radial-gauge'
import { Slider } from '@/components/ui/slider'
import { useLifeOsStore } from '@/store/lifeOsStore'
import { ENERGY_CATEGORIES, DAILY_ENERGY_BUDGET, ENERGY_CATEGORY_BUDGET } from '@/lib/types'
import { ENERGY_CATEGORY_META } from '@/lib/energy-meta'

function levelColor(ratio: number): string {
  if (ratio > 0.5) return 'var(--color-success)'
  if (ratio > 0.2) return 'var(--color-warning)'
  return 'var(--color-danger)'
}

export function EnergyTracker() {
  const energy = useLifeOsStore((s) => s.getTodaysEnergy())
  const setEnergySpent = useLifeOsStore((s) => s.setEnergySpent)

  const spent = energy?.spent
  const totalSpent = ENERGY_CATEGORIES.reduce((sum, category) => sum + (spent?.[category] ?? 0), 0)
  const remaining = Math.max(0, DAILY_ENERGY_BUDGET - totalSpent)
  const remainingRatio = remaining / DAILY_ENERGY_BUDGET

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-center">
        <RadialGauge value={remaining} max={DAILY_ENERGY_BUDGET} size={160} strokeWidth={14} color={levelColor(remainingRatio)}>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-semibold">{remaining}</span>
            <span className="text-xs text-muted-foreground">of {DAILY_ENERGY_BUDGET} coins left</span>
          </div>
        </RadialGauge>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {ENERGY_CATEGORIES.map((category) => {
          const meta = ENERGY_CATEGORY_META[category]
          const Icon = meta.icon
          const value = spent?.[category] ?? 0

          return (
            <div key={category} className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-3">
              <RadialGauge value={value} max={ENERGY_CATEGORY_BUDGET} size={64} strokeWidth={6} color={meta.hex}>
                <Icon className={`size-5 ${meta.textClass}`} />
              </RadialGauge>
              <div className="text-center">
                <p className="text-xs font-medium">{meta.label}</p>
                <p className="text-xs text-muted-foreground">{value} / {ENERGY_CATEGORY_BUDGET}</p>
              </div>
              <Slider
                min={0}
                max={ENERGY_CATEGORY_BUDGET}
                value={value}
                onChange={(e) => setEnergySpent(category, Number(e.target.value))}
                style={{ accentColor: meta.hex }}
                aria-label={`${meta.label} energy spent`}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
