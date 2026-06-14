"use client";

import { useRef, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ChevronDown, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { quickCapture } from "@/lib/actions/life-objects";
import { LIFE_OBJECT_STATUSES, LIFE_OBJECT_TYPES } from "@/lib/types/database";
import type { LifeObjectStatus, LifeObjectType } from "@/lib/types/database";
import { statusLabel, typeLabel } from "@/lib/life-object-meta";
import { cn } from "@/lib/utils";

export function QuickCapture({ onCaptured }: { onCaptured?: () => void }) {
  const [title, setTitle] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [type, setType] = useState<LifeObjectType>("note");
  const [status, setStatus] = useState<LifeObjectStatus>("new");
  const [tagsInput, setTagsInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function reset() {
    setTitle("");
    setTagsInput("");
    setType("note");
    setStatus("new");
    setExpanded(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    startTransition(async () => {
      try {
        await quickCapture({ title: trimmed, type, status, tags });
        toast.success("Captured");
        reset();
        onCaptured?.();
        inputRef.current?.focus();
      } catch {
        toast.error("Couldn't save. Try again.");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border/60 bg-card shadow-sm transition-shadow focus-within:shadow-md"
    >
      <div className="flex items-center gap-2 px-3 py-2.5">
        <Input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setExpanded(true)}
          placeholder="Capture a thought, idea, or task…"
          className="border-0 px-1 shadow-none focus-visible:ring-0 text-[15px]"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors"
          aria-label="Toggle details"
        >
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")}
          />
        </button>
        <Button
          type="submit"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-full"
          disabled={!title.trim() || isPending}
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2 px-3 pb-3 pt-1">
              <div className="flex gap-2">
                <Select value={type} onValueChange={(v) => setType(v as LifeObjectType)}>
                  <SelectTrigger className="h-8 flex-1 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LIFE_OBJECT_TYPES.map((t) => (
                      <SelectItem key={t} value={t} className="text-xs">
                        {typeLabel(t)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={status} onValueChange={(v) => setStatus(v as LifeObjectStatus)}>
                  <SelectTrigger className="h-8 flex-1 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LIFE_OBJECT_STATUSES.map((s) => (
                      <SelectItem key={s} value={s} className="text-xs">
                        {statusLabel(s)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="relative">
                <Input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Tags (comma separated)"
                  className="h-8 text-xs"
                />
                {tagsInput && (
                  <button
                    type="button"
                    onClick={() => setTagsInput("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
