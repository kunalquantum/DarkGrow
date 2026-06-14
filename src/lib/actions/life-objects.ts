"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  LIFE_OBJECT_STATUSES,
  LIFE_OBJECT_TYPES,
  type ActivityAction,
  type LifeObject,
  type LifeObjectStatus,
  type LifeObjectType,
} from "@/lib/types/database";

export interface QuickCaptureInput {
  title: string;
  type?: LifeObjectType;
  status?: LifeObjectStatus;
  progress?: number;
  tags?: string[];
  description?: string;
}

export interface CreateLifeObjectInput extends QuickCaptureInput {
  importance?: number;
  energy?: number;
  notes?: string;
  start_date?: string | null;
  target_date?: string | null;
  completed_date?: string | null;
}

export interface UpdateLifeObjectInput {
  title?: string;
  description?: string | null;
  type?: LifeObjectType;
  status?: LifeObjectStatus;
  progress?: number;
  tags?: string[];
  importance?: number | null;
  energy?: number | null;
  notes?: string | null;
  start_date?: string | null;
  target_date?: string | null;
  completed_date?: string | null;
}

async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw new Error("Not authenticated");
  }
  return { supabase, userId: data.user.id };
}

async function logActivity(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  lifeObjectId: string,
  action: ActivityAction,
  summary: string,
  fieldChanged?: string,
  oldValue?: string | null,
  newValue?: string | null
) {
  await supabase.from("activity_history").insert({
    user_id: userId,
    life_object_id: lifeObjectId,
    action,
    summary,
    field_changed: fieldChanged ?? null,
    old_value: oldValue ?? null,
    new_value: newValue ?? null,
  });
}

/**
 * Quick Capture - the most important entry point. Saves a new Life Object
 * with only a title required; everything else is optional.
 */
export async function quickCapture(input: QuickCaptureInput) {
  const { supabase, userId } = await requireUser();

  const title = input.title.trim();
  if (!title) {
    throw new Error("Title is required");
  }

  const { data, error } = await supabase
    .from("life_objects")
    .insert({
      user_id: userId,
      title,
      description: input.description ?? null,
      type: input.type ?? "note",
      status: input.status ?? "new",
      progress: input.progress ?? 0,
      tags: input.tags ?? [],
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  await logActivity(supabase, userId, data.id, "created", `Created "${title}"`);

  revalidatePath("/");
  revalidatePath("/timeline");
  revalidatePath("/insights");
  revalidatePath("/search");

  return data as LifeObject;
}

export async function createLifeObject(input: CreateLifeObjectInput) {
  const { supabase, userId } = await requireUser();

  const title = input.title.trim();
  if (!title) {
    throw new Error("Title is required");
  }

  const { data, error } = await supabase
    .from("life_objects")
    .insert({
      user_id: userId,
      title,
      description: input.description ?? null,
      type: input.type ?? "note",
      status: input.status ?? "new",
      progress: input.progress ?? 0,
      tags: input.tags ?? [],
      importance: input.importance ?? null,
      energy: input.energy ?? null,
      notes: input.notes ?? null,
      start_date: input.start_date ?? null,
      target_date: input.target_date ?? null,
      completed_date: input.completed_date ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  await logActivity(supabase, userId, data.id, "created", `Created "${title}"`);

  revalidatePath("/");
  revalidatePath("/timeline");
  revalidatePath("/insights");
  revalidatePath("/search");

  return data as LifeObject;
}

export async function updateLifeObject(id: string, input: UpdateLifeObjectInput) {
  const { supabase, userId } = await requireUser();

  const { data: existing, error: fetchError } = await supabase
    .from("life_objects")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !existing) throw new Error("Life object not found");

  const updatePayload: Partial<LifeObject> = { ...input };

  // Auto-set completed_date when transitioning to completed status.
  if (input.status === "completed" && existing.status !== "completed" && !input.completed_date) {
    updatePayload.completed_date = new Date().toISOString().slice(0, 10);
  }

  const { data, error } = await supabase
    .from("life_objects")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Activity logging for meaningful field changes.
  if (input.status && input.status !== existing.status) {
    const statusActionMap: Record<LifeObjectStatus, ActivityAction> = {
      new: "status_changed",
      active: "resumed",
      paused: "paused",
      completed: "completed",
      cancelled: "cancelled",
      archived: "archived",
    };
    await logActivity(
      supabase,
      userId,
      id,
      statusActionMap[input.status],
      `Status changed from ${existing.status} to ${input.status} on "${existing.title}"`,
      "status",
      existing.status,
      input.status
    );
  }

  if (typeof input.progress === "number" && input.progress !== existing.progress) {
    await logActivity(
      supabase,
      userId,
      id,
      "progress_updated",
      `Progress updated to ${input.progress}% on "${existing.title}"`,
      "progress",
      String(existing.progress),
      String(input.progress)
    );
  }

  const otherFieldsChanged = Object.keys(input).some(
    (key) => key !== "status" && key !== "progress" && key !== "completed_date"
  );

  if (otherFieldsChanged) {
    await logActivity(
      supabase,
      userId,
      id,
      "updated",
      `Updated "${existing.title}"`
    );
  }

  revalidatePath("/");
  revalidatePath("/timeline");
  revalidatePath("/insights");
  revalidatePath("/search");
  revalidatePath(`/object/${id}`);

  return data as LifeObject;
}

export async function deleteLifeObject(id: string) {
  const { supabase } = await requireUser();

  const { error } = await supabase.from("life_objects").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/timeline");
  revalidatePath("/insights");
  revalidatePath("/search");
}

export interface ListLifeObjectsOptions {
  type?: LifeObjectType;
  status?: LifeObjectStatus | LifeObjectStatus[];
  limit?: number;
  offset?: number;
  orderBy?: "created_at" | "updated_at";
}

export async function listLifeObjects(options: ListLifeObjectsOptions = {}) {
  const supabase = await createClient();

  let query = supabase
    .from("life_objects")
    .select("*")
    .order(options.orderBy ?? "created_at", { ascending: false });

  if (options.type) query = query.eq("type", options.type);

  if (options.status) {
    if (Array.isArray(options.status)) {
      query = query.in("status", options.status);
    } else {
      query = query.eq("status", options.status);
    }
  }

  if (options.limit) query = query.limit(options.limit);
  if (options.offset) query = query.range(options.offset, options.offset + (options.limit ?? 50) - 1);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return (data ?? []) as LifeObject[];
}

export async function getLifeObject(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("life_objects").select("*").eq("id", id).single();
  if (error) throw new Error(error.message);
  return data as LifeObject;
}

export async function searchLifeObjects(query: string) {
  const supabase = await createClient();

  const trimmed = query.trim();
  if (!trimmed) return [] as LifeObject[];

  const lower = trimmed.toLowerCase();
  const term = `%${trimmed}%`;

  const { data, error } = await supabase
    .from("life_objects")
    .select("*")
    .or(`title.ilike.${term},description.ilike.${term},notes.ilike.${term}`)
    .order("updated_at", { ascending: false })
    .limit(50);

  if (error) throw new Error(error.message);

  const results = (data ?? []) as LifeObject[];

  // Also search by tag match (Postgres `ilike` over arrays isn't directly
  // supported via the JS client filter syntax, so do a second pass).
  const { data: tagMatches } = await supabase
    .from("life_objects")
    .select("*")
    .contains("tags", [lower]);

  for (const obj of (tagMatches ?? []) as LifeObject[]) {
    if (!results.find((r) => r.id === obj.id)) results.push(obj);
  }

  // Match by type or status keyword (e.g. "project", "completed").
  if (LIFE_OBJECT_TYPES.includes(lower as LifeObjectType)) {
    const { data: typeMatches } = await supabase
      .from("life_objects")
      .select("*")
      .eq("type", lower as LifeObjectType)
      .order("updated_at", { ascending: false })
      .limit(50);

    for (const obj of (typeMatches ?? []) as LifeObject[]) {
      if (!results.find((r) => r.id === obj.id)) results.push(obj);
    }
  }

  if (LIFE_OBJECT_STATUSES.includes(lower as LifeObjectStatus)) {
    const { data: statusMatches } = await supabase
      .from("life_objects")
      .select("*")
      .eq("status", lower as LifeObjectStatus)
      .order("updated_at", { ascending: false })
      .limit(50);

    for (const obj of (statusMatches ?? []) as LifeObject[]) {
      if (!results.find((r) => r.id === obj.id)) results.push(obj);
    }
  }

  return results;
}
