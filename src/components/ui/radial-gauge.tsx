import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type RadialGaugeProps = {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  color?: string
  trackClassName?: string
  className?: string
  children?: ReactNode
}

export function RadialGauge({
  value,
  max,
  size = 120,
  strokeWidth = 10,
  color = 'var(--color-accent)',
  trackClassName,
  className,
  children,
}: RadialGaugeProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const ratio = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0
  const offset = circumference - ratio * circumference

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className={cn('stroke-muted', trackClassName)}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  )
}
