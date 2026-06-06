import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export default function AuthHeader({ title, subtitle, icon: Icon = ShieldCheck }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="mb-8 text-center"
    >
      <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/20">
        <Icon className="h-6 w-6 text-white" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground dark:text-dark-foreground sm:text-[28px]">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-sm leading-relaxed text-muted dark:text-dark-muted">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}