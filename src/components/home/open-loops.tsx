import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { TYPE_META } from "@/lib/life-object-meta";
import type { LifeObject } from "@/lib/types/database";

export function OpenLoops({ items }: { items: LifeObject[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/60 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          No open loops. Capture something to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const Icon = TYPE_META[item.type].icon;
        return (
          <Link
            key={item.id}
            href={`/object/${item.id}`}
            className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card px-3 py-2.5 transition-colors hover:bg-muted/50"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium leading-tight">{item.title}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <Progress value={item.progress} className="h-1.5 flex-1" />
                <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                  {item.progress}%
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
