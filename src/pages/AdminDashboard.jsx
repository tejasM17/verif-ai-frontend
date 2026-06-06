import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Users, Building2, Activity } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth/student/login', { replace: true });
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
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg shadow-rose-500/20">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-dark-foreground">
                    Admin Dashboard
                  </h1>
                  <p className="text-sm text-dark-muted">
                    Platform administration and oversight
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: 'Total Users', value: '0', icon: Users, color: 'from-blue-500 to-blue-600' },
                { label: 'Active Recruiters', value: '0', icon: Building2, color: 'from-emerald-500 to-emerald-600' },
                { label: 'Platform Activity', value: '0', icon: Activity, color: 'from-purple-500 to-purple-600' },
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
              <Shield className="mx-auto h-12 w-12 text-dark-muted mb-3" />
              <h2 className="text-lg font-semibold text-dark-foreground mb-1">
                Admin Panel
              </h2>
              <p className="text-sm text-dark-muted">
                Manage users, monitor platform activity, and configure settings.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
