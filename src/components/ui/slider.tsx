import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Slider = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="range"
        className={cn('h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-accent', className)}
        {...props}
      />
    )
  },
)
Slider.displayName = 'Slider'
