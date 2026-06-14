"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActivityHistoryEntry } from "@/lib/types/database";

export interface ListActivityOptions {
  limit?: number;
  since?: string;
}

export async function listActivityHistory(options: ListActivityOptions = {}) {
  const supabase = await createClient();

  let query = supabase
    .from("activity_history")
    .select("*")
    .order("created_at", { ascending: false });

  if (options.since) query = query.gte("created_at", options.since);
  if (options.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return (data ?? []) as ActivityHistoryEntry[];
}

export async function listAllActivityHistory() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("activity_history")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as ActivityHistoryEntry[];
}
