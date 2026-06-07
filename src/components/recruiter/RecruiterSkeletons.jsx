import { motion } from 'framer-motion';

export function InboxSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex gap-3 mb-6">
        <div className="h-10 w-64 skeleton-pulse rounded-lg" />
        <div className="h-10 w-32 skeleton-pulse rounded-lg" />
        <div className="h-10 w-32 skeleton-pulse rounded-lg" />
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-24 rounded-xl skeleton-pulse" />
      ))}
    </motion.div>
  );
}

export function DetailPanelSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-full skeleton-pulse" />
        <div className="space-y-2 flex-1">
          <div className="h-5 w-48 skeleton-pulse rounded-md" />
          <div className="h-4 w-32 skeleton-pulse rounded-md" />
        </div>
      </div>
      <div className="h-32 rounded-xl skeleton-pulse" />
      <div className="h-48 rounded-xl skeleton-pulse" />
      <div className="h-40 rounded-xl skeleton-pulse" />
    </motion.div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-28 rounded-xl skeleton-pulse" />
      ))}
    </div>
  );
}

export function VerificationSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 rounded-xl skeleton-pulse" />
        ))}
      </div>
      <div className="h-48 rounded-xl skeleton-pulse" />
    </motion.div>
  );
}
