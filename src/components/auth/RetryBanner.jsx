import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function RetryBanner({ message }) {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: -8, height: 0 }}
      transition={{ duration: 0.2 }}
      role="status"
      aria-live="polite"
      className="overflow-hidden"
    >
      <div className="mb-4 flex items-center gap-2.5 rounded-lg border border-primary-500/20 bg-primary-500/5 p-3 text-sm text-primary-700 dark:text-primary-300">
        <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
        <span className="flex-1">{message}</span>
      </div>
    </motion.div>
  );
}
