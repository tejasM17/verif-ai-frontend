import { motion } from 'framer-motion';

export default function AuthCard({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`w-full max-w-[440px] rounded-2xl border border-border/60 bg-surface p-8 shadow-card dark:border-dark-border dark:bg-dark-surface sm:p-10 ${className}`}
    >
      {children}
    </motion.div>
  );
}