import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TimerReset, LogIn } from 'lucide-react';
import { AuthCard } from '../components/auth';

export default function SessionExpired() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AuthCard>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
            <TimerReset className="h-8 w-8 text-white" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground dark:text-dark-foreground">
            Session expired
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted dark:text-dark-muted">
            Your session has expired due to inactivity. Don't worry, your data is safe.
            Please sign in again to continue.
          </p>
        </motion.div>

        <div className="mt-8 space-y-3">
          <Link
            to="/auth/student/login"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 transition-all duration-200 hover:from-primary-500 hover:to-primary-600 hover:shadow-xl active:scale-[0.98]"
          >
            <LogIn className="h-4 w-4" />
            Sign in as Student
          </Link>

          <Link
            to="/auth/recruiter/login"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:bg-surface-hover active:scale-[0.98] dark:border-dark-border dark:bg-dark-surface dark:text-dark-foreground dark:hover:bg-dark-surface-hover"
          >
            <LogIn className="h-4 w-4" />
            Sign in as Recruiter
          </Link>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted dark:text-dark-muted">
            Need help?{' '}
            <a
              href="#"
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 transition-colors"
            >
              Contact support
            </a>
          </p>
        </div>
      </AuthCard>
    </motion.div>
  );
}