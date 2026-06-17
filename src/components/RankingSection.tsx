"use client";

import { useState } from "react";
import { getRankings } from "@/lib/mock-data";
import MovieCard from "@/components/MovieCard";
import { cn } from "@/lib/utils";

const periods = [
  { key: "daily" as const, label: "Daily" },
  { key: "weekly" as const, label: "Weekly" },
  { key: "monthly" as const, label: "Monthly" },
  { key: "yearly" as const, label: "Yearly" },
];

export default function RankingSection() {
  const [activePeriod, setActivePeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("daily");
  const rankings = getRankings(activePeriod);

  return (
    <section>
      <div className="flex items-center justify-between mb-4 px-4 lg:px-0">
        <h2 className="text-lg font-extrabold text-white">Ranking</h2>
        <div className="flex gap-1 bg-dark-800 rounded-lg p-1">
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => setActivePeriod(p.key)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                activePeriod === p.key
                  ? "bg-accent text-dark-950 font-bold"
                  : "text-dark-400 hover:text-white hover:bg-dark-700"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0 px-4 lg:px-0">
        {rankings.map((movie, i) => (
          <MovieCard key={movie.id} movie={movie} variant="ranking" rank={i + 1} />
        ))}
      </div>
    </section>
  );
}
