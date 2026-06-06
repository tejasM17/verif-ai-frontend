import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Briefcase, Users, BarChart3 } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

export default function RecruiterDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth/recruiter/login', { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  if (authLoading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-dark-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-dvh bg-dark-background">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-dark-foreground">
                    {user?.company_name || 'Recruiter Dashboard'}
                  </h1>
                  <p className="text-sm text-dark-muted">
                    Welcome back, {user?.recruiter_name || 'Recruiter'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: 'Active Jobs', value: '0', icon: Briefcase, color: 'from-blue-500 to-blue-600' },
                { label: 'Total Applicants', value: '0', icon: Users, color: 'from-purple-500 to-purple-600' },
                { label: 'Interviews Scheduled', value: '0', icon: BarChart3, color: 'from-amber-500 to-amber-600' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-dark-border bg-dark-surface p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-dark-muted">{stat.label}</span>
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${stat.color}`}>
                      <stat.icon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-dark-foreground">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-dark-border bg-dark-surface p-8 text-center">
              <Building2 className="mx-auto h-12 w-12 text-dark-muted mb-3" />
              <h2 className="text-lg font-semibold text-dark-foreground mb-1">
                Recruiter Dashboard
              </h2>
              <p className="text-sm text-dark-muted">
                Start posting jobs and finding top verified candidates.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
