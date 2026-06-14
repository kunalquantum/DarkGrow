import { Activity, CheckCircle2, Clock, Lightbulb, ListTodo, Target, Timer } from 'lucide-react'
import { useLifeOsStore } from '@/store/lifeOsStore'
import { buildInsightsSummary, energyBreakdown } from '@/lib/analytics'
import { ENERGY_CATEGORY_BUDGET } from '@/lib/types'
import { ENERGY_CATEGORY_META } from '@/lib/energy-meta'
import { StatCard } from '@/components/insights/stat-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export default function InsightsPage() {
  const lifeObjects = useLifeOsStore((s) => s.lifeObjects)
  const relationships = useLifeOsStore((s) => s.relationships)
  const activityHistory = useLifeOsStore((s) => s.activityHistory)
  const dailyEnergyLogs = useLifeOsStore((s) => s.dailyEnergyLogs)

  const summary = buildInsightsSummary(lifeObjects, relationships, activityHistory)
  const energy = energyBreakdown(dailyEnergyLogs)

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold">Insights</h1>
        <p className="text-sm text-muted-foreground">Patterns from what you've captured.</p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Total objects" value={String(summary.totalObjects)} icon={Activity} />
        <StatCard
          label="Completion rate"
          value={`${Math.round(summary.completionRate * 100)}%`}
          icon={CheckCircle2}
        />
        <StatCard label="Open loops" value={String(summary.openLoops.length)} icon={ListTodo} />
        <StatCard
          label="Avg. time to finish"
          value={summary.averageCompletionDays !== null ? `${summary.averageCompletionDays.toFixed(1)}d` : '—'}
          icon={Timer}
        />
        <StatCard
          label="Idea conversion"
          value={`${Math.round(summary.ideaConversionRate * 100)}%`}
          icon={Lightbulb}
        />
        <StatCard
          label="Project success"
          value={`${Math.round(summary.projectSuccessRate * 100)}%`}
          icon={Target}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-muted-foreground">Life momentum</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <p className="text-2xl font-semibold">{summary.lifeMomentum}</p>
          <Progress value={summary.lifeMomentum} />
          <p className="text-xs text-muted-foreground">
            Based on recent activity compared to the previous week.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-muted-foreground">Most active topics</CardTitle>
        </CardHeader>
        <CardContent>
          {summary.mostActiveTopics.length === 0 ? (
            <p className="text-sm text-muted-foreground">Add tags to your objects to see topics here.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {summary.mostActiveTopics.map((topic) => (
                <span
                  key={topic.tag}
                  className="rounded-full border border-border bg-muted px-3 py-1 text-xs"
                >
                  #{topic.tag} · {topic.count}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-muted-foreground">Where your energy goes</CardTitle>
        </CardHeader>
        <CardContent>
          {dailyEnergyLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground">Log energy on the home screen to see trends here.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {energy.map(({ category, average }) => {
                const meta = ENERGY_CATEGORY_META[category]
                const Icon = meta.icon
                return (
                  <div key={category} className="flex items-center gap-3">
                    <Icon className={`size-4 shrink-0 ${meta.textClass}`} />
                    <div className="flex-1">
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span>{meta.label}</span>
                        <span className="text-muted-foreground">{average.toFixed(1)} / {ENERGY_CATEGORY_BUDGET} avg</span>
                      </div>
                      <Progress value={(average / ENERGY_CATEGORY_BUDGET) * 100} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-muted-foreground">Most productive days</CardTitle>
        </CardHeader>
        <CardContent>
          {summary.mostProductiveDays.length === 0 ? (
            <p className="text-sm text-muted-foreground">Not enough activity yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {summary.mostProductiveDays.map((day) => (
                <div key={day.day} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Clock className="size-4 text-muted-foreground" />
                    {day.day}
                  </span>
                  <span className="text-muted-foreground">{day.count} entries</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
