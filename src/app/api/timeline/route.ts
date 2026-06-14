import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const PAGE_SIZE = 25;

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();

  if (authError || !userData.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const offset = Number(request.nextUrl.searchParams.get("offset") ?? "0");

  const { data, error } = await supabase
    .from("life_objects")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    items: data ?? [],
    nextOffset: (data?.length ?? 0) === PAGE_SIZE ? offset + PAGE_SIZE : null,
  });
}
