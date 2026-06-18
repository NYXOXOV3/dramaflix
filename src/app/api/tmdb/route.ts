import { NextRequest, NextResponse } from "next/server";

const TMDB_BASE = "https://api.themoviedb.org/3";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "details"; // "details" | "search" | "test"
  const apiKey = searchParams.get("key") || process.env.TMDB_API_KEY || "";
  const lang = searchParams.get("lang") || "en-US";

  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: "TMDB API key not configured. Set it in TMDB Settings or TMDB_API_KEY env variable." },
      { status: 500 }
    );
  }

  // ---- TEST CONNECTION ----
  if (action === "test") {
    try {
      const res = await fetch(`${TMDB_BASE}/configuration?api_key=${apiKey}`);
      if (!res.ok) {
        return NextResponse.json({ success: false, error: `Invalid API key (status ${res.status})` });
      }
      return NextResponse.json({ success: true, message: "Connection successful!" });
    } catch {
      return NextResponse.json({ success: false, error: "Network error connecting to TMDB" });
    }
  }

  // ---- SEARCH BY TITLE ----
  if (action === "search") {
    const query = searchParams.get("q");
    const type = searchParams.get("type") || "movie";

    if (!query) {
      return NextResponse.json({ success: false, error: "Missing 'q' parameter" }, { status: 400 });
    }

    try {
      const res = await fetch(
        `${TMDB_BASE}/search/${type}?api_key=${apiKey}&language=${lang}&query=${encodeURIComponent(query)}&page=1`
      );
      if (!res.ok) {
        return NextResponse.json({ success: false, error: `TMDB returned ${res.status}` }, { status: res.status });
      }
      const data = await res.json();
      const results = (data.results || []).slice(0, 20).map((item: Record<string, unknown>) => ({
        id: item.id,
        title: type === "movie" ? item.title : item.name,
        originalTitle: type === "movie" ? item.original_title : item.original_name,
        synopsis: item.overview || "",
        coverImage: item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : "",
        bannerImage: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : "",
        rating: item.vote_average ? Math.round((item.vote_average as number) * 10) / 10 : 0,
        year: item.release_date ? parseInt((item.release_date as string).split("-")[0]) :
              item.first_air_date ? parseInt((item.first_air_date as string).split("-")[0]) : 0,
        popularity: item.popularity || 0,
      }));
      return NextResponse.json({ success: true, results, total: data.total_results || 0 });
    } catch {
      return NextResponse.json({ success: false, error: "Failed to search TMDB" }, { status: 500 });
    }
  }

  // ---- FETCH DETAILS BY ID ----
  const tmdbId = searchParams.get("id");
  const type = searchParams.get("type") || "movie";

  if (!tmdbId) {
    return NextResponse.json({ success: false, error: "Missing 'id' parameter" }, { status: 400 });
  }

  try {
    const detailRes = await fetch(
      `${TMDB_BASE}/${type}/${tmdbId}?api_key=${apiKey}&language=${lang}&append_to_response=credits,videos,similar`
    );
    if (!detailRes.ok) {
      return NextResponse.json({ success: false, error: `TMDB returned ${detailRes.status}` }, { status: detailRes.status });
    }
    const data = await detailRes.json();

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        title: type === "movie" ? data.title : data.name,
        originalTitle: type === "movie" ? data.original_title : data.original_name,
        synopsis: data.overview || "",
        coverImage: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : "",
        bannerImage: data.backdrop_path ? `https://image.tmdb.org/t/p/w1280${data.backdrop_path}` : "",
        rating: data.vote_average ? Math.round(data.vote_average * 10) / 10 : 0,
        year: data.release_date ? parseInt(data.release_date.split("-")[0]) :
              data.first_air_date ? parseInt(data.first_air_date.split("-")[0]) : 0,
        genres: (data.genres || []).map((g: { name: string }) => g.name),
        country: (data.production_countries || []).map((c: { name: string }) => c.name).join(", ") || "Unknown",
        status: data.status || "Released",
        runtime: data.runtime || (data.episode_run_time && data.episode_run_time[0]) || 0,
        totalEpisodes: data.number_of_episodes || 0,
        totalSeasons: data.number_of_seasons || 0,
        cast: (data.credits?.cast || []).slice(0, 10).map((c: { name: string; character: string; profile_path: string | null }) => ({
          name: c.name, character: c.character,
          photo: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : "",
        })),
        trailers: (data.videos?.results || [])
          .filter((v: { type: string; site: string }) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"))
          .slice(0, 3).map((v: { key: string; name: string }) => ({ key: v.key, name: v.name })),
        similar: (data.similar?.results || []).slice(0, 6).map((s: { id: number; title?: string; name?: string; poster_path: string | null; vote_average: number }) => ({
          id: s.id, title: s.title || s.name,
          poster: s.poster_path ? `https://image.tmdb.org/t/p/w300${s.poster_path}` : "",
          rating: s.vote_average,
        })),
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch from TMDB" }, { status: 500 });
  }
}
