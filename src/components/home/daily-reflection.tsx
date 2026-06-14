"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { saveTodaysReflection } from "@/lib/actions/reflections";
import type { DailyReflection as DailyReflectionType } from "@/lib/types/database";
import { cn } from "@/lib/utils";

const MOODS = [
  { value: 1, emoji: "😔" },
  { value: 2, emoji: "😕" },
  { value: 3, emoji: "😐" },
  { value: 4, emoji: "🙂" },
  { value: 5, emoji: "😄" },
];

export function DailyReflection({ initial }: { initial: DailyReflectionType | null }) {
  const [content, setContent] = useState(initial?.content ?? "");
  const [mood, setMood] = useState<number | null>(initial?.mood ?? null);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(!!initial);

  function handleSave() {
    if (!content.trim()) return;
    startTransition(async () => {
      try {
        await saveTodaysReflection(content.trim(), mood ?? undefined);
        toast.success("Reflection saved");
        setSaved(true);
      } catch {
        toast.error("Couldn't save reflection");
      }
    });
  }

  return (
    <div className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setSaved(false);
        }}
        placeholder="How did today go? What did you notice?"
        className="min-h-[88px] resize-none text-sm"
      />
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {MOODS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => {
                setMood(m.value);
                setSaved(false);
              }}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-base transition-all",
                mood === m.value
                  ? "bg-foreground/10 scale-110"
                  : "opacity-50 hover:opacity-100"
              )}
              aria-label={`Mood ${m.value}`}
            >
              {m.emoji}
            </button>
          ))}
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleSave}
          disabled={!content.trim() || isPending || saved}
        >
          {saved ? "Saved" : isPending ? "Saving…" : "Save"}
        </Button>
      </div>
    </div>
  );
}
