import { QuickCapture } from '@/components/home/quick-capture'
import { OpenLoops } from '@/components/home/open-loops'
import { RecentActivity } from '@/components/home/recent-activity'
import { DailyReflection } from '@/components/home/daily-reflection'
import { EnergyTracker } from '@/components/home/energy-tracker'

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="bg-gradient-to-r from-accent to-foreground bg-clip-text text-2xl font-semibold text-transparent">
          Life OS
        </h1>
        <p className="text-sm text-muted-foreground">Capture everything. Forget nothing.</p>
      </header>

      <section>
        <QuickCapture />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-muted-foreground">Energy coins</h2>
        <EnergyTracker />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-muted-foreground">Open loops</h2>
        <OpenLoops />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-muted-foreground">Recent activity</h2>
        <RecentActivity />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-muted-foreground">Daily reflection</h2>
        <DailyReflection />
      </section>
    </div>
  )
}
