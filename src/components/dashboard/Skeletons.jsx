import { motion } from 'framer-motion';

export function DashboardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <div className="h-8 w-72 skeleton-pulse rounded-lg" />
        <div className="h-4 w-96 skeleton-pulse rounded-md" />
      </div>
      <div className="flex gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-9 w-32 skeleton-pulse rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-xl skeleton-pulse" />
        ))}
      </div>
      <div className="h-72 rounded-xl skeleton-pulse" />
    </motion.div>
  );
}

export function ProfileCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-xl border border-dark-border bg-dark-surface p-6 space-y-4"
    >
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full skeleton-pulse" />
        <div className="space-y-2 flex-1">
          <div className="h-5 w-48 skeleton-pulse rounded-md" />
          <div className="h-4 w-32 skeleton-pulse rounded-md" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-1">
            <div className="h-3 w-16 skeleton-pulse rounded" />
            <div className="h-4 w-32 skeleton-pulse rounded-md" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-28 rounded-xl skeleton-pulse" />
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-xl border border-dark-border bg-dark-surface p-6 space-y-5"
    >
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-3 w-24 skeleton-pulse rounded" />
          <div className="h-10 w-full skeleton-pulse rounded-lg" />
        </div>
      ))}
      <div className="flex gap-3 pt-2">
        <div className="h-10 w-28 skeleton-pulse rounded-lg" />
        <div className="h-10 w-28 skeleton-pulse rounded-lg" />
      </div>
    </motion.div>
  );
}
