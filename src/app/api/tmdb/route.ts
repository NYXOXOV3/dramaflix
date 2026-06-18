import { NextRequest, NextResponse } from "next/server";

const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_KEY = process.env.TMDB_API_KEY || "";

export async function GET(request: NextRequest) {
  if (!TMDB_KEY) {
    return NextResponse.json(
      { success: false, error: "TMDB_API_KEY not configured" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const tmdbId = searchParams.get("id");
  const type = searchParams.get("type") || "movie"; // "movie" or "tv"
  const lang = searchParams.get("lang") || "en-US";

  if (!tmdbId) {
    return NextResponse.json(
      { success: false, error: "Missing 'id' parameter" },
      { status: 400 }
    );
  }

  try {
    // Fetch main details
    const detailRes = await fetch(
      `${TMDB_BASE}/${type}/${tmdbId}?api_key=${TMDB_KEY}&language=${lang}&append_to_response=credits,videos,similar`
    );

    if (!detailRes.ok) {
      return NextResponse.json(
        { success: false, error: `TMDB returned ${detailRes.status}` },
        { status: detailRes.status }
      );
    }

    const data = await detailRes.json();

    // Extract useful info
    const result = {
      success: true,
      data: {
        id: data.id,
        title: type === "movie" ? data.title : data.name,
        originalTitle: type === "movie" ? data.original_title : data.original_name,
        synopsis: data.overview || "",
        coverImage: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : "",
        bannerImage: data.backdrop_path ? `https://image.tmdb.org/t/p/w1280${data.backdrop_path}` : "",
        rating: data.vote_average ? Math.round(data.vote_average * 10) / 10 : 0,
        year: data.release_date ? parseInt(data.release_date.split("-")[0]) : (data.first_air_date ? parseInt(data.first_air_date.split("-")[0]) : 0),
        genres: (data.genres || []).map((g: { name: string }) => g.name),
        country: (data.production_countries || []).map((c: { name: string }) => c.name).join(", ") || "Unknown",
        status: data.status || "Released",
        runtime: data.runtime || (data.episode_run_time && data.episode_run_time[0]) || 0,
        totalEpisodes: data.number_of_episodes || 0,
        totalSeasons: data.number_of_seasons || 0,
        cast: (data.credits?.cast || []).slice(0, 10).map((c: { name: string; character: string; profile_path: string | null }) => ({
          name: c.name,
          character: c.character,
          photo: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : "",
        })),
        trailers: (data.videos?.results || [])
          .filter((v: { type: string; site: string }) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"))
          .slice(0, 3)
          .map((v: { key: string; name: string }) => ({ key: v.key, name: v.name })),
        similar: (data.similar?.results || []).slice(0, 6).map((s: { id: number; title?: string; name?: string; poster_path: string | null; vote_average: number }) => ({
          id: s.id,
          title: s.title || s.name,
          poster: s.poster_path ? `https://image.tmdb.org/t/p/w300${s.poster_path}` : "",
          rating: s.vote_average,
        })),
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch from TMDB" },
      { status: 500 }
    );
  }
}
