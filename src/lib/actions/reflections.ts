"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { DailyReflection } from "@/lib/types/database";

async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw new Error("Not authenticated");
  }
  return { supabase, userId: data.user.id };
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export async function getTodaysReflection() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("daily_reflections")
    .select("*")
    .eq("reflection_date", today())
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data ?? null) as DailyReflection | null;
}

export async function saveTodaysReflection(content: string, mood?: number) {
  const { supabase, userId } = await requireUser();

  const { data, error } = await supabase
    .from("daily_reflections")
    .upsert(
      {
        user_id: userId,
        reflection_date: today(),
        content,
        mood: mood ?? null,
      },
      { onConflict: "user_id,reflection_date" }
    )
    .select()
    .single();

  if (error) throw new Error(error.message);

  await supabase.from("activity_history").insert({
    user_id: userId,
    action: "created",
    summary: "Added Daily Reflection",
  });

  revalidatePath("/");
  revalidatePath("/timeline");

  return data as DailyReflection;
}
