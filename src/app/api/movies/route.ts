import { NextRequest, NextResponse } from "next/server";
import { movies, searchMovies } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const sort = searchParams.get("sort");
  const category = searchParams.get("category");
  const limit = parseInt(searchParams.get("limit") || "20");

  try {
    let results = [...movies];

    // Search
    if (query) {
      results = searchMovies(query);
    }

    // Category filter
    if (category) {
      results = results.filter((m) => m.category === category);
    }

    // Sort
    if (sort === "popular") {
      results.sort((a, b) => b.views - a.views);
    } else if (sort === "rating") {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sort === "latest") {
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Limit
    results = results.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
      query: query || null,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
