import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  X,
  RefreshCw,
  Inbox,
  LayoutDashboard,
  Briefcase,
  Users,
  BarChart3,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import RecruiterSidebar from '../components/recruiter/RecruiterSidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import LogoutModal from '../components/dashboard/LogoutModal';
import ErrorBoundary from '../components/common/ErrorBoundary';
import ApplicationInbox from '../components/recruiter/ApplicationInbox';
import ApplicationDetailPanel from '../components/recruiter/ApplicationDetailPanel';
import { StatsSkeleton } from '../components/recruiter/RecruiterSkeletons';
import recruiterService from '../services/recruiterService';

export default function RecruiterDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('recruiter_sidebar_collapsed');
    if (saved !== null) return saved === 'true';
    return window.innerWidth < 1024;
  });

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeView, setActiveView] = useState('inbox');
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [inboxRefreshKey, setInboxRefreshKey] = useState(0);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem('recruiter_sidebar_collapsed', sidebarCollapsed);
  }, [sidebarCollapsed]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth/recruiter/login', { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (activeView !== 'applications') return;
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const res = await recruiterService.getDashboardStats();
        const data = res.data || res;
        setStats(data);
      } catch {
        setStats(null);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, [activeView]);

  const handleToggleCollapse = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const handleMobileClose = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const handleSelectApplication = useCallback((app) => {
    setSelectedApplication(app);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedApplication(null);
  }, []);

  const handleStatusUpdate = useCallback((appId, newStatus) => {
    setInboxRefreshKey((k) => k + 1);
    setToast({ type: 'success', message: `Status updated to ${newStatus.replace(/_/g, ' ')}` });
  }, []);

  if (authLoading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-dark-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const renderContent = () => {
    switch (activeView) {
      case 'inbox':
        return (
          <motion.div
            key="inbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <DashboardHeader
              title="Application Inbox"
              subtitle="Review and manage student applications"
              onMobileMenuOpen={() => setMobileOpen(true)}
              actions={
                <button
                  onClick={() => setInboxRefreshKey((k) => k + 1)}
                  className="inline-flex items-center gap-2 rounded-lg border border-dark-border px-4 py-2 text-sm font-medium text-dark-foreground hover:bg-dark-surface-hover transition-all duration-200 active:scale-[0.97]"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              }
            />
            <ApplicationInbox
              onSelectApplication={handleSelectApplication}
              refreshKey={inboxRefreshKey}
            />
          </motion.div>
        );

      case 'applications':
        return (
          <motion.div
            key="applications"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <DashboardHeader
              title="Applications Overview"
              subtitle="Track all applications and hiring pipeline"
              onMobileMenuOpen={() => setMobileOpen(true)}
            />

            {statsLoading ? (
              <StatsSkeleton />
            ) : stats ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: 'Total Applications', value: stats.total_applications || 0, icon: Inbox, color: 'from-primary-500 to-primary-600' },
                  { label: 'Under Review', value: stats.reviewing_count || 0, icon: Users, color: 'from-amber-500 to-amber-600' },
                  { label: 'Selected', value: stats.selected_count || 0, icon: CheckCircle, color: 'from-emerald-500 to-emerald-600' },
                  { label: 'Open Positions', value: stats.open_positions || 0, icon: Briefcase, color: 'from-purple-500 to-purple-600' },
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
            ) : (
              <div className="rounded-xl border border-dark-border bg-dark-surface p-8 text-center">
                <BarChart3 className="mx-auto h-8 w-8 text-dark-muted mb-2" />
                <p className="text-sm text-dark-muted">Stats unavailable</p>
              </div>
            )}
          </motion.div>
        );

      case 'settings':
        return (
          <motion.div
            key="settings"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <DashboardHeader
              title="Settings"
              subtitle="Account and company settings"
              onMobileMenuOpen={() => setMobileOpen(true)}
            />
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
              <div className="rounded-2xl bg-dark-surface-muted p-5 mb-4">
                <LayoutDashboard className="h-10 w-10 text-dark-muted" />
              </div>
              <h2 className="text-xl font-semibold text-dark-foreground">Settings</h2>
              <p className="text-sm text-dark-muted mt-1">Account and company settings</p>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-dvh bg-dark-background">
      <RecruiterSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
        mobileOpen={mobileOpen}
        onMobileClose={handleMobileClose}
        activeView={activeView}
        onNavigate={setActiveView}
        user={user}
        onLogoutClick={() => setLogoutModalOpen(true)}
      />

      <main className="flex-1 overflow-y-auto min-h-dvh">
        <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <ErrorBoundary
              title="Dashboard Error"
              message="The dashboard encountered an error. Please try refreshing."
            >
              {renderContent()}
            </ErrorBoundary>
          </AnimatePresence>
        </div>
      </main>

      {selectedApplication && (
        <div className="hidden lg:block w-[420px] xl:w-[480px] flex-shrink-0">
          <ApplicationDetailPanel
            application={selectedApplication}
            onClose={handleCloseDetail}
            onStatusUpdate={handleStatusUpdate}
          />
        </div>
      )}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed top-4 left-1/2 z-50 flex items-center gap-2.5 rounded-xl border border-dark-border bg-dark-surface px-5 py-3 shadow-2xl"
          >
            <CheckCircle className="h-5 w-5 text-secondary-400 flex-shrink-0" />
            <span className="text-sm font-medium text-dark-foreground">
              {toast.message}
            </span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 rounded-lg p-1 text-dark-muted hover:bg-dark-surface-hover hover:text-dark-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <LogoutModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
      />
    </div>
  );
}
