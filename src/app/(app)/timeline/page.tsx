import { createClient } from "@/lib/supabase/server";
import { TimelineList } from "@/components/timeline/timeline-list";
import type { LifeObject } from "@/lib/types/database";

const PAGE_SIZE = 25;

export default async function TimelinePage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("life_objects")
    .select("*")
    .order("created_at", { ascending: false })
    .range(0, PAGE_SIZE - 1);

  const items = (data ?? []) as LifeObject[];

  return (
    <div className="space-y-4 pt-2">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">Timeline</h1>
        <p className="text-sm text-muted-foreground">Your life history, newest first.</p>
      </header>

      <TimelineList
        initialItems={items}
        initialNextOffset={items.length === PAGE_SIZE ? PAGE_SIZE : null}
      />
    </div>
  );
}
