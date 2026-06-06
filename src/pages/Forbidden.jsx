import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldBan, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Forbidden() {
  const { role } = useAuth();

  const dashboardLink = role === 'student'
    ? '/student/dashboard'
    : role === 'recruiter'
      ? '/recruiter/dashboard'
      : role === 'admin'
        ? '/admin/dashboard'
        : '/auth/student/login';

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-[#0f0f1a] via-[#13132b] to-[#0f0f1a] p-4">
      <div className="mesh-gradient-dark absolute inset-0 opacity-60" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-full max-w-md text-center"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg shadow-red-500/20">
          <ShieldBan className="h-10 w-10 text-white" />
        </div>

        <h1 className="text-3xl font-bold text-white">Access Denied</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          You don\u2019t have permission to access this page. If you believe this is a
          mistake, please contact your administrator.
        </p>

        <div className="mt-8 space-y-3">
          <Link
            to={dashboardLink}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 transition-all duration-200 hover:from-primary-500 hover:to-primary-600 hover:shadow-xl active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {role ? 'Dashboard' : 'Login'}
          </Link>
        </div>

        <p className="mt-6 text-xs text-white/30">
          Need help?{' '}
          <a
            href="#"
            className="font-medium text-primary-400 hover:text-primary-300 transition-colors"
          >
            Contact support
          </a>
        </p>
      </motion.div>
    </div>
  );
}
