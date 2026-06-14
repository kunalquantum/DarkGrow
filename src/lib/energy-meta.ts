import { Brain, Heart, Palette, type LucideIcon, Users, Zap } from 'lucide-react'
import type { EnergyCategory } from './types'

type EnergyCategoryMeta = {
  label: string
  icon: LucideIcon
  /** Tailwind text-color utility, used for icons and small accents. */
  textClass: string
  /** Raw hex, used for SVG strokes and the slider thumb/track (accent-color). */
  hex: string
}

export const ENERGY_CATEGORY_META: Record<EnergyCategory, EnergyCategoryMeta> = {
  mental: { label: 'Mental', icon: Brain, textClass: 'text-violet-400', hex: '#a78bfa' },
  physical: { label: 'Physical', icon: Zap, textClass: 'text-emerald-400', hex: '#34d399' },
  social: { label: 'Social', icon: Users, textClass: 'text-sky-400', hex: '#38bdf8' },
  creative: { label: 'Creative', icon: Palette, textClass: 'text-amber-400', hex: '#fbbf24' },
  emotional: { label: 'Emotional', icon: Heart, textClass: 'text-rose-400', hex: '#fb7185' },
}
