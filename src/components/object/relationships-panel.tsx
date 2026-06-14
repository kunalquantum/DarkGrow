"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Link2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TYPE_META } from "@/lib/life-object-meta";
import { RELATIONSHIP_TYPES, type LifeObject, type RelationshipType } from "@/lib/types/database";
import { searchLifeObjects } from "@/lib/actions/life-objects";
import { createRelationship, deleteRelationship } from "@/lib/actions/relationships";

export interface RelatedItem {
  relationshipId: string;
  type: RelationshipType;
  direction: "out" | "in";
  object: LifeObject;
}

const RELATIONSHIP_LABELS: Record<RelationshipType, { out: string; in: string }> = {
  related_to: { out: "Related to", in: "Related to" },
  created_from: { out: "Created from", in: "Source for" },
  supports: { out: "Supports", in: "Supported by" },
  depends_on: { out: "Depends on", in: "Required by" },
  inspired_by: { out: "Inspired by", in: "Inspired" },
  resulted_in: { out: "Resulted in", in: "Resulted from" },
};

export function RelationshipsPanel({
  objectId,
  items,
}: {
  objectId: string;
  items: RelatedItem[];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LifeObject[]>([]);
  const [relType, setRelType] = useState<RelationshipType>("related_to");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const timeout = setTimeout(async () => {
      const data = await searchLifeObjects(trimmed);
      setResults(data.filter((o) => o.id !== objectId));
    }, 250);
    return () => clearTimeout(timeout);
  }, [query, objectId]);

  const displayResults = query.trim() ? results : [];

  function handleLink(targetId: string) {
    startTransition(async () => {
      try {
        await createRelationship(objectId, targetId, relType);
        toast.success("Linked");
        setOpen(false);
        setQuery("");
        setResults([]);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Couldn't link");
      }
    });
  }

  function handleUnlink(relationshipId: string) {
    startTransition(async () => {
      try {
        await deleteRelationship(relationshipId);
        toast.success("Unlinked");
      } catch {
        toast.error("Couldn't unlink");
      }
    });
  }

  return (
    <div className="space-y-2">
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground">No connections yet.</p>
      )}

      {items.map(({ relationshipId, type, direction, object }) => {
        const Icon = TYPE_META[object.type].icon;
        return (
          <div
            key={relationshipId}
            className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card px-3 py-2.5"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <Link href={`/object/${object.id}`} className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{object.title}</p>
              <p className="text-xs text-muted-foreground">
                {RELATIONSHIP_LABELS[type][direction]}
              </p>
            </Link>
            <button
              onClick={() => handleUnlink(relationshipId)}
              disabled={isPending}
              className="text-muted-foreground hover:text-destructive"
              aria-label="Remove link"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button variant="outline" size="sm" className="w-full" />}>
          <Plus className="h-4 w-4 mr-1.5" />
          Link to another life object
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="h-4 w-4" /> Add connection
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Select value={relType} onValueChange={(v) => setRelType(v as RelationshipType)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RELATIONSHIP_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a life object…"
              autoFocus
            />

            <div className="max-h-64 space-y-1 overflow-y-auto">
              {displayResults.map((obj) => {
                const Icon = TYPE_META[obj.type].icon;
                return (
                  <button
                    key={obj.id}
                    onClick={() => handleLink(obj.id)}
                    disabled={isPending}
                    className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm hover:bg-muted transition-colors"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="truncate">{obj.title}</span>
                  </button>
                );
              })}
              {query.trim() && displayResults.length === 0 && (
                <p className="px-2 py-2 text-sm text-muted-foreground">No matches.</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
