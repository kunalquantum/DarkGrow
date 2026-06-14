import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ObjectEditor } from "@/components/object/object-editor";
import { RelationshipsPanel, type RelatedItem } from "@/components/object/relationships-panel";
import { ActivityLog } from "@/components/object/activity-log";
import { Section } from "@/components/shared/section";
import type { ActivityHistoryEntry, LifeObject, LifeObjectRelationship } from "@/lib/types/database";

export default async function ObjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: object }, { data: relationships }, { data: history }] = await Promise.all([
    supabase.from("life_objects").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("life_object_relationships")
      .select("*")
      .or(`from_object_id.eq.${id},to_object_id.eq.${id}`),
    supabase
      .from("activity_history")
      .select("*")
      .eq("life_object_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!object) notFound();

  const relationshipRows = (relationships ?? []) as LifeObjectRelationship[];
  const relatedIds = Array.from(
    new Set(
      relationshipRows.map((r) => (r.from_object_id === id ? r.to_object_id : r.from_object_id))
    )
  );

  let relatedItems: RelatedItem[] = [];
  if (relatedIds.length > 0) {
    const { data: relatedObjects } = await supabase
      .from("life_objects")
      .select("*")
      .in("id", relatedIds);

    const byId = new Map(
      ((relatedObjects ?? []) as LifeObject[]).map((o) => [o.id, o] as const)
    );

    relatedItems = relationshipRows
      .map((r) => {
        const direction = r.from_object_id === id ? "out" : "in";
        const otherId = direction === "out" ? r.to_object_id : r.from_object_id;
        const obj = byId.get(otherId);
        if (!obj) return null;
        return {
          relationshipId: r.id,
          type: r.relationship_type,
          direction,
          object: obj,
        } as RelatedItem;
      })
      .filter((x): x is RelatedItem => x !== null);
  }

  return (
    <div className="space-y-6 pt-2">
      <Link
        href="/timeline"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </Link>

      <ObjectEditor object={object as LifeObject} />

      <Section title="Connections">
        <RelationshipsPanel objectId={id} items={relatedItems} />
      </Section>

      <Section title="History">
        <ActivityLog items={(history ?? []) as ActivityHistoryEntry[]} />
      </Section>
    </div>
  );
}
