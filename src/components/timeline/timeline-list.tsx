"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { TimelineItem } from "@/components/timeline/timeline-item";
import { groupLabel } from "@/lib/format";
import type { LifeObject } from "@/lib/types/database";

export function TimelineList({
  initialItems,
  initialNextOffset,
}: {
  initialItems: LifeObject[];
  initialNextOffset: number | null;
}) {
  const [items, setItems] = useState(initialItems);
  const [nextOffset, setNextOffset] = useState(initialNextOffset);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (nextOffset === null || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/timeline?offset=${nextOffset}`);
      if (!res.ok) return;
      const data = await res.json();
      setItems((prev) => [...prev, ...data.items]);
      setNextOffset(data.nextOffset);
    } finally {
      setLoading(false);
    }
  }, [nextOffset, loading]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const grouped = useMemo(() => {
    const labels = items.map((item) => groupLabel(item.created_at));
    return items.map((item, index) => ({
      item,
      label: labels[index],
      showHeader: index === 0 || labels[index] !== labels[index - 1],
    }));
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/60 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Nothing here yet. Capture your first life object on Home.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {grouped.map(({ item, label, showHeader }) => (
        <div key={item.id}>
          {showHeader && (
            <h2 className="sticky top-0 z-10 -mx-4 bg-background/85 px-4 py-2 text-sm font-semibold text-muted-foreground backdrop-blur-sm">
              {label}
            </h2>
          )}
          <TimelineItem item={item} />
        </div>
      ))}

      <div ref={sentinelRef} className="flex justify-center py-4">
        {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        {nextOffset === null && (
          <p className="text-xs text-muted-foreground">You&apos;ve reached the beginning.</p>
        )}
      </div>
    </div>
  );
}
