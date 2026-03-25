// app/api/tmdb/route.ts
import { NextRequest, NextResponse } from "next/server";

const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_KEY  = process.env.TMDB_API_KEY;

export async function GET(request: NextRequest) {
  if (!TMDB_KEY) {
    return NextResponse.json({ error: "TMDB key not configured" }, { status: 500 });
  }

  const { searchParams } = request.nextUrl;
  const endpoint = searchParams.get("endpoint");

  if (!endpoint) {
    return NextResponse.json({ error: "Missing endpoint" }, { status: 400 });
  }

  const params = new URLSearchParams();
  params.set("api_key", TMDB_KEY);
  searchParams.forEach((value, key) => {
    if (key !== "endpoint") params.set(key, value);
  });

  const url = `${TMDB_BASE}/${endpoint}?${params.toString()}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return NextResponse.json({ error: `TMDB error: ${res.status}` }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch TMDB" }, { status: 500 });
  }
}