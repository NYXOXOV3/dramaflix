import { NextRequest, NextResponse } from "next/server";
import { getMovieBySlug } from "@/lib/mock-data";
import { generateEpisodes } from "@/lib/mock-data";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const movie = getMovieBySlug(params.slug);

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
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
