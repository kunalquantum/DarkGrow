"use client";

import { useEffect, useState, useTransition } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TimelineItem } from "@/components/timeline/timeline-item";
import { searchLifeObjects } from "@/lib/actions/life-objects";
import type { LifeObject } from "@/lib/types/database";

export function SearchView() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LifeObject[]>([]);
  const [searchedQuery, setSearchedQuery] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const timeout = setTimeout(() => {
      startTransition(async () => {
        const data = await searchLifeObjects(trimmed);
        setResults(data);
        setSearchedQuery(trimmed);
      });
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  const trimmedQuery = query.trim();
  const displayResults = trimmedQuery ? results : [];
  const hasSearched = trimmedQuery.length > 0 && searchedQuery === trimmedQuery;

  return (
    <div className="space-y-4 pt-2">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">Search</h1>
        <p className="text-sm text-muted-foreground">
          Search titles, descriptions, tags, types, and statuses.
        </p>
      </header>

      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your life…"
          className="pl-9 pr-9 h-11 rounded-2xl"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isPending && <p className="text-sm text-muted-foreground">Searching…</p>}

      {!isPending && hasSearched && displayResults.length === 0 && (
        <p className="text-sm text-muted-foreground">No results for &quot;{query}&quot;.</p>
      )}

      {!isPending && displayResults.length > 0 && (
        <div className="space-y-2">
          {displayResults.map((item) => (
            <TimelineItem key={item.id} item={item} />
          ))}
        </div>
      )}

      {!query && (
        <div className="rounded-2xl border border-dashed border-border/60 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Try searching for a title, a tag like <span className="font-medium">#smartbook</span>,
            or a status like <span className="font-medium">completed</span>.
          </p>
        </div>
      )}
    </div>
  );
}
