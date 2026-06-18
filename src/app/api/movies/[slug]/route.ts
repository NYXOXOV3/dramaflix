import { NextRequest, NextResponse } from "next/server";
import { movies, generateEpisodes } from "@/lib/mock-data";
import type { Movie } from "@/lib/types";

// Server-side movie store seeded from mock data
const serverMovieStore: Movie[] = [...movies];

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const movie = serverMovieStore.find((m) => m.slug === params.slug);

    if (!movie) {
      return NextResponse.json(
        { success: false, error: "Movie not found" },
        { status: 404 }
      );
    }

    const episodes = generateEpisodes(movie.id, movie.totalEpisodes, movie.freeEpisodes);

    return NextResponse.json({
      success: true,
      data: { ...movie, episodes },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
