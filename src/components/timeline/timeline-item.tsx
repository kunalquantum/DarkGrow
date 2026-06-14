import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { STATUS_META, TYPE_META } from "@/lib/life-object-meta";
import { friendlyDate } from "@/lib/format";
import type { LifeObject } from "@/lib/types/database";

export function TimelineItem({ item }: { item: LifeObject }) {
  const Icon = TYPE_META[item.type].icon;
  const status = STATUS_META[item.status];

  return (
    <Link
      href={`/object/${item.id}`}
      className="flex gap-3 rounded-2xl border border-border/60 bg-card px-3 py-3 transition-colors hover:bg-muted/50"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-tight">{item.title}</p>
          <span className="shrink-0 text-xs text-muted-foreground">
            {friendlyDate(item.created_at)}
          </span>
        </div>
        {item.description && (
          <p className="line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <Badge variant="secondary" className={`text-[10px] ${status.className}`}>
            {status.label}
          </Badge>
          {item.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-[10px] text-muted-foreground">
              #{tag}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  );
}
