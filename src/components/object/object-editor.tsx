"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LIFE_OBJECT_STATUSES,
  LIFE_OBJECT_TYPES,
  type LifeObject,
  type LifeObjectStatus,
  type LifeObjectType,
} from "@/lib/types/database";
import { statusLabel, typeLabel } from "@/lib/life-object-meta";
import { updateLifeObject, deleteLifeObject } from "@/lib/actions/life-objects";

export function ObjectEditor({ object }: { object: LifeObject }) {
  const router = useRouter();
  const [title, setTitle] = useState(object.title);
  const [description, setDescription] = useState(object.description ?? "");
  const [notes, setNotes] = useState(object.notes ?? "");
  const [tagsInput, setTagsInput] = useState(object.tags.join(", "));
  const [progress, setProgress] = useState(object.progress);
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDelete] = useTransition();

  function save(partial: Parameters<typeof updateLifeObject>[1], silent = false) {
    startTransition(async () => {
      try {
        await updateLifeObject(object.id, partial);
        if (!silent) toast.success("Saved");
      } catch {
        toast.error("Couldn't save changes");
      }
    });
  }

  function handleDelete() {
    if (!confirm(`Delete "${object.title}"? This cannot be undone.`)) return;
    startDelete(async () => {
      try {
        await deleteLifeObject(object.id);
        toast.success("Deleted");
        router.push("/timeline");
      } catch {
        toast.error("Couldn't delete");
      }
    });
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => title.trim() && title !== object.title && save({ title: title.trim() })}
          className="text-base font-medium"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => description !== (object.description ?? "") && save({ description: description || null })}
          placeholder="Add more detail…"
          className="min-h-[72px] resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={object.type}
            onValueChange={(v) => save({ type: v as LifeObjectType })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LIFE_OBJECT_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {typeLabel(t)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={object.status}
            onValueChange={(v) => save({ status: v as LifeObjectStatus })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LIFE_OBJECT_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {statusLabel(s)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Progress</Label>
          <span className="text-sm text-muted-foreground tabular-nums">{progress}%</span>
        </div>
        <Slider
          value={[progress]}
          max={100}
          step={5}
          onValueChange={(v) => setProgress(Array.isArray(v) ? v[0] : v)}
          onValueCommitted={(v) => save({ progress: Array.isArray(v) ? v[0] : v }, true)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          onBlur={() => {
            const tags = tagsInput
              .split(",")
              .map((t) => t.trim().toLowerCase())
              .filter(Boolean);
            if (JSON.stringify(tags) !== JSON.stringify(object.tags)) save({ tags });
          }}
          placeholder="tag-one, tag-two"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Importance (1-5)</Label>
          <Select
            value={object.importance ? String(object.importance) : "none"}
            onValueChange={(v) => save({ importance: v === "none" ? null : Number(v) })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">—</SelectItem>
              {[1, 2, 3, 4, 5].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Energy (1-5)</Label>
          <Select
            value={object.energy ? String(object.energy) : "none"}
            onValueChange={(v) => save({ energy: v === "none" ? null : Number(v) })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">—</SelectItem>
              {[1, 2, 3, 4, 5].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-2">
          <Label htmlFor="start_date">Start</Label>
          <Input
            id="start_date"
            type="date"
            defaultValue={object.start_date ?? ""}
            onChange={(e) => save({ start_date: e.target.value || null })}
            className="text-xs"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="target_date">Target</Label>
          <Input
            id="target_date"
            type="date"
            defaultValue={object.target_date ?? ""}
            onChange={(e) => save({ target_date: e.target.value || null })}
            className="text-xs"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="completed_date">Done</Label>
          <Input
            id="completed_date"
            type="date"
            defaultValue={object.completed_date ?? ""}
            onChange={(e) => save({ completed_date: e.target.value || null })}
            className="text-xs"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => notes !== (object.notes ?? "") && save({ notes: notes || null })}
          placeholder="Private notes…"
          className="min-h-[72px] resize-none"
        />
      </div>

      <Button
        variant="ghost"
        className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={handleDelete}
        disabled={isDeleting || isPending}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete Life Object
      </Button>
    </div>
  );
}
