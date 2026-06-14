import { createClient } from "@/lib/supabase/server";
import { listLifeObjects } from "@/lib/actions/life-objects";
import { listActivityHistory } from "@/lib/actions/activity";
import { getTodaysReflection } from "@/lib/actions/reflections";
import { openLoops } from "@/lib/analytics";
import { QuickCapture } from "@/components/home/quick-capture";
import { OpenLoops } from "@/components/home/open-loops";
import { RecentActivity } from "@/components/home/recent-activity";
import { DailyReflection } from "@/components/home/daily-reflection";
import { Section } from "@/components/shared/section";
import { SignOutButton } from "@/components/shared/sign-out-button";

function greeting(hour: number, name: string) {
  if (hour < 5) return `Still up, ${name}?`;
  if (hour < 12) return `Good morning, ${name}`;
  if (hour < 18) return `Good afternoon, ${name}`;
  return `Good evening, ${name}`;
}

export default async function HomePage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const name =
    (userData.user?.user_metadata?.name as string | undefined) ??
    userData.user?.email?.split("@")[0] ??
    "there";

  const [objects, activity, reflection] = await Promise.all([
    listLifeObjects({ limit: 200 }),
    listActivityHistory({ limit: 8 }),
    getTodaysReflection(),
  ]);

  const loops = openLoops(objects).slice(0, 6);
  const today = new Date();

  return (
    <div className="space-y-8 pt-2">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground">
            {today.toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="text-xl font-semibold tracking-tight">
            {greeting(today.getHours(), name)}
          </h1>
        </div>
        <SignOutButton />
      </header>

      <QuickCapture />

      <Section title="Open Loops" href="/timeline" hrefLabel="Timeline">
        <OpenLoops items={loops} />
      </Section>

      <Section title="Recent Activity">
        <RecentActivity items={activity} />
      </Section>

      <Section title="Daily Reflection">
        <DailyReflection initial={reflection} />
      </Section>
    </div>
  );
}
