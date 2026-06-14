import { listLifeObjects } from "@/lib/actions/life-objects";
import { listAllRelationships } from "@/lib/actions/relationships";
import { listAllActivityHistory } from "@/lib/actions/activity";
import { buildInsightsSummary } from "@/lib/analytics";
import { StatCard } from "@/components/insights/stat-card";
import { Section } from "@/components/shared/section";
import { Badge } from "@/components/ui/badge";

export default async function InsightsPage() {
  const [objects, relationships, history] = await Promise.all([
    listLifeObjects(),
    listAllRelationships(),
    listAllActivityHistory(),
  ]);

  const summary = buildInsightsSummary(objects, relationships, history);
  const momentumDelta = summary.lifeMomentum - summary.lifeMomentumPrevious;

  return (
    <div className="space-y-8 pt-2">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">Insights</h1>
        <p className="text-sm text-muted-foreground">Patterns from your life, computed locally.</p>
      </header>

      <Section title="Overview">
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Total Life Objects" value={summary.totalObjects} />
          <StatCard label="Open Loops" value={summary.openLoopCount} />
          <StatCard label="Completion Rate" value={summary.completionRate} suffix="%" />
          <StatCard
            label="Life Momentum"
            value={summary.lifeMomentum}
            hint={
              momentumDelta === 0
                ? "Same as last week"
                : `${momentumDelta > 0 ? "+" : ""}${momentumDelta} vs last week`
            }
          />
        </div>
      </Section>

      <Section title="Projects & Ideas">
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Projects Started" value={summary.projectsStarted} />
          <StatCard label="Projects Completed" value={summary.projectsCompleted} />
          <StatCard label="Project Success Rate" value={summary.projectSuccessRate} suffix="%" />
          <StatCard label="Ideas Captured" value={summary.ideasCaptured} />
          <StatCard label="Idea Conversion Rate" value={summary.ideaConversionRate} suffix="%" />
          <StatCard label="Goals Achieved" value={summary.goalsAchieved} />
        </div>
      </Section>

      <Section title="Speed">
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Avg. Completion Time"
            value={summary.averageCompletionDays ?? "—"}
            suffix={summary.averageCompletionDays !== null ? " days" : undefined}
          />
        </div>
      </Section>

      <Section title="Most Active Topics">
        {summary.mostActiveTopics.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Add tags to your life objects to see your most active topics.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {summary.mostActiveTopics.map((topic) => (
              <Badge key={topic.tag} variant="secondary" className="text-xs">
                #{topic.tag}
                <span className="ml-1 text-muted-foreground">{topic.count}</span>
              </Badge>
            ))}
          </div>
        )}
      </Section>

      <Section title="Most Productive Days">
        {summary.mostProductiveDays.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Complete or update life objects to surface your most productive days.
          </p>
        ) : (
          <div className="space-y-2">
            {summary.mostProductiveDays.map((day) => (
              <div
                key={day.day}
                className="flex items-center justify-between rounded-2xl border border-border/60 bg-card px-4 py-2.5"
              >
                <span className="text-sm font-medium">{day.day}</span>
                <span className="text-sm text-muted-foreground">{day.count} events</span>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
