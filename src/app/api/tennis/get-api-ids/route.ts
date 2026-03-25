/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/tennis/get-api-ids/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { playerIds } = await req.json();

    if (!playerIds || !Array.isArray(playerIds)) {
      return NextResponse.json({ apiIds: [] });
    }

    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { db: { schema: 'sport' } }
    );

    const { data } = await adminClient
      .from("tennis_players")
      .select("thesportsdb_id")
      .in("id", playerIds)
      .not("thesportsdb_id", "is", null);

    const apiIds = (data ?? [])
      .map(p => p.thesportsdb_id?.toString())
      .filter(Boolean);

    return NextResponse.json({ apiIds });

  } catch (err: any) {
    console.error("Get API IDs error:", err);
    return NextResponse.json({ apiIds: [] });
  }
}