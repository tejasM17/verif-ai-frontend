export function CompanyCardSkeleton() {
  return (
    <div className="rounded-xl border border-dark-border bg-dark-surface p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg skeleton-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-32 skeleton-pulse rounded" />
            <div className="h-3 w-24 skeleton-pulse rounded" />
          </div>
        </div>
        <div className="h-6 w-16 skeleton-pulse rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full skeleton-pulse rounded" />
        <div className="h-3 w-3/4 skeleton-pulse rounded" />
      </div>
      <div className="flex gap-1.5">
        <div className="h-5 w-14 skeleton-pulse rounded-md" />
        <div className="h-5 w-16 skeleton-pulse rounded-md" />
        <div className="h-5 w-12 skeleton-pulse rounded-md" />
      </div>
      <div className="flex gap-1.5">
        <div className="h-5 w-20 skeleton-pulse rounded-md" />
        <div className="h-5 w-14 skeleton-pulse rounded-md" />
      </div>
      <div className="flex gap-4 pt-3 border-t border-dark-border">
        <div className="h-3 w-28 skeleton-pulse rounded" />
        <div className="h-3 w-20 skeleton-pulse rounded" />
      </div>
    </div>
  );
}

export function CompanyGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CompanyCardSkeleton key={i} />
      ))}
    </div>
  );
}
