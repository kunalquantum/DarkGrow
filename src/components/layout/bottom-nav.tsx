import { NavLink, useLocation } from 'react-router-dom'
import { BarChart3, Clock, Home, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/timeline', label: 'Timeline', icon: Clock },
  { to: '/insights', label: 'Insights', icon: BarChart3 },
  { to: '/search', label: 'Search', icon: Search },
]

export function BottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex max-w-xl items-stretch justify-between px-2">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

          return (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={cn(
                'relative flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors',
                isActive ? 'text-accent' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {isActive ? (
                <motion.span
                  layoutId="bottom-nav-pill"
                  className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-accent"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              ) : null}
              <motion.span whileTap={{ scale: 0.9 }} className="flex flex-col items-center gap-1">
                <Icon className="size-5" />
                {label}
              </motion.span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
