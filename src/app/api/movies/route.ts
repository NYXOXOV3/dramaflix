import { NextRequest, NextResponse } from "next/server";
import { movies } from "@/lib/mock-data";
import type { Movie } from "@/lib/types";

// In-memory store for API (since no Supabase connection)
let movieStore: Movie[] = [...movies];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const sort = searchParams.get("sort");
  const category = searchParams.get("category");
  const limit = parseInt(searchParams.get("limit") || "20");

  try {
    let results = [...movieStore];

    // Search
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.synopsis.toLowerCase().includes(q) ||
          m.genre.some((g) => g.toLowerCase().includes(q)) ||
          m.provider.toLowerCase().includes(q)
      );
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
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, synopsis, country, status, genre, provider, providerSlug, rating, totalEpisodes, freeEpisodes, year, category, isVipOnly, coverImage, bannerImage, videoUrl } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { success: false, error: "Title and slug are required" },
        { status: 400 }
      );
    }

    const existing = movieStore.find((m) => m.slug === slug);
    if (existing) {
      return NextResponse.json(
        { success: false, error: "A movie with this slug already exists" },
        { status: 409 }
      );
    }

    const newMovie: Movie = {
      id: `m${Date.now()}`,
      slug,
      title,
      synopsis: synopsis || "",
      coverImage: coverImage || `https://picsum.photos/seed/${slug}/300/450`,
      bannerImage: bannerImage || undefined,
      videoUrl: videoUrl || undefined,
      country: country || "China",
      status: status || "Ongoing",
      genre: Array.isArray(genre) ? genre : genre ? genre.split(",").map((g: string) => g.trim()) : [],
      provider: provider || "CubeTV",
      providerSlug: providerSlug || (provider || "cubetv").toLowerCase().replace(/\s+/g, ""),
      rating: rating || 4.0,
      views: 0,
      totalEpisodes: totalEpisodes || 10,
      freeEpisodes: freeEpisodes || 3,
      year: year || 2025,
      isVipOnly: isVipOnly || false,
      isTrending: false,
      isNew: true,
      category: category || "drama",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    movieStore = [newMovie, ...movieStore];

    return NextResponse.json({
      success: true,
      data: newMovie,
      message: "Movie created successfully",
    }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Movie ID is required" },
        { status: 400 }
      );
    }

    const movieIndex = movieStore.findIndex((m) => m.id === id);
    if (movieIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Movie not found" },
        { status: 404 }
      );
    }

    movieStore[movieIndex] = {
      ...movieStore[movieIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: movieStore[movieIndex],
      message: "Movie updated successfully",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Movie ID is required (use ?id=xxx)" },
        { status: 400 }
      );
    }

    const movieIndex = movieStore.findIndex((m) => m.id === id);
    if (movieIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Movie not found" },
        { status: 404 }
      );
    }

    const deleted = movieStore[movieIndex];
    movieStore = movieStore.filter((m) => m.id !== id);

    return NextResponse.json({
      success: true,
      data: deleted,
      message: "Movie deleted successfully",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
