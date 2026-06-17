export default function SkeletonCard() {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="aspect-[2/3] rounded-xl bg-dark-800 shimmer-bg" />
      <div className="mt-2 space-y-2">
        <div className="h-4 bg-dark-800 rounded w-3/4 shimmer-bg" />
        <div className="h-3 bg-dark-800 rounded w-1/2 shimmer-bg" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-3 animate-pulse">
      <div className="w-8 h-8 rounded bg-dark-800 shimmer-bg" />
      <div className="w-14 h-20 rounded-lg bg-dark-800 shimmer-bg" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-dark-800 rounded w-3/4 shimmer-bg" />
        <div className="h-3 bg-dark-800 rounded w-1/2 shimmer-bg" />
      </div>
    </div>
  );
}
