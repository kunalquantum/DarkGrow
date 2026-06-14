"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { LifeObjectRelationship, RelationshipType } from "@/lib/types/database";

async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw new Error("Not authenticated");
  }
  return { supabase, userId: data.user.id };
}

export async function createRelationship(
  fromObjectId: string,
  toObjectId: string,
  relationshipType: RelationshipType
) {
  const { supabase, userId } = await requireUser();

  if (fromObjectId === toObjectId) {
    throw new Error("A life object cannot relate to itself");
  }

  const { data, error } = await supabase
    .from("life_object_relationships")
    .insert({
      user_id: userId,
      from_object_id: fromObjectId,
      to_object_id: toObjectId,
      relationship_type: relationshipType,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  await supabase.from("activity_history").insert({
    user_id: userId,
    life_object_id: fromObjectId,
    action: "relationship_added",
    summary: `Linked (${relationshipType}) to another life object`,
  });

  revalidatePath(`/object/${fromObjectId}`);
  revalidatePath(`/object/${toObjectId}`);

  return data as LifeObjectRelationship;
}

export async function deleteRelationship(id: string) {
  const { supabase, userId } = await requireUser();

  const { data: existing } = await supabase
    .from("life_object_relationships")
    .select("*")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("life_object_relationships").delete().eq("id", id);
  if (error) throw new Error(error.message);

  if (existing) {
    await supabase.from("activity_history").insert({
      user_id: userId,
      life_object_id: existing.from_object_id,
      action: "relationship_removed",
      summary: `Removed (${existing.relationship_type}) link`,
    });
    revalidatePath(`/object/${existing.from_object_id}`);
    revalidatePath(`/object/${existing.to_object_id}`);
  }
}

export async function listRelationships(objectId?: string) {
  const supabase = await createClient();

  let query = supabase.from("life_object_relationships").select("*");

  if (objectId) {
    query = query.or(`from_object_id.eq.${objectId},to_object_id.eq.${objectId}`);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return (data ?? []) as LifeObjectRelationship[];
}

export async function listAllRelationships() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("life_object_relationships").select("*");
  if (error) throw new Error(error.message);
  return (data ?? []) as LifeObjectRelationship[];
}
