import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, Settings, FileText, Activity, HelpCircle, RefreshCw, User } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useStudentProfile } from '../hooks/useStudentProfile';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatsCards from '../components/dashboard/StatsCards';
import ProfileCard from '../components/dashboard/ProfileCard';
import ProfileForm from '../components/dashboard/ProfileForm';
import LogoutModal from '../components/dashboard/LogoutModal';
import { DashboardSkeleton } from '../components/dashboard/Skeletons';
import ErrorBoundary from '../components/common/ErrorBoundary';

export default function StudentDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const {
    profile,
    loading: profileLoading,
    error: profileError,
    saving,
    completion,
    refreshProfile,
    updateProfile,
  } = useStudentProfile();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    if (saved !== null) return saved === 'true';
    return window.innerWidth < 1024;
  });

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', sidebarCollapsed);
  }, [sidebarCollapsed]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth/student/login', { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleProfileUpdate = useCallback(
    async (data) => {
      setFormError(null);
      const result = await updateProfile(data);
      if (result.success) {
        setToast({ type: 'success', message: 'Profile updated successfully' });
      } else {
        setFormError(result.error);
      }
    },
    [updateProfile]
  );

  const handleToggleCollapse = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const handleMobileClose = useCallback(() => {
    setMobileOpen(false);
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
      case 'dashboard':
        return (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <DashboardHeader
              title="Dashboard"
              subtitle="Overview of your profile and activity"
              onMobileMenuOpen={() => setMobileOpen(true)}
              actions={
                <>
                  <button
                    onClick={() => setActiveView('edit')}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500 transition-all duration-200 active:scale-[0.97]"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Edit Profile</span>
                  </button>
                  <button
                    onClick={refreshProfile}
                    className="inline-flex items-center gap-2 rounded-lg border border-dark-border px-4 py-2 text-sm font-medium text-dark-foreground hover:bg-dark-surface-hover transition-all duration-200 active:scale-[0.97]"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                </>
              }
            />

            {profileLoading ? (
              <DashboardSkeleton />
            ) : profileError ? (
              <div className="rounded-xl border border-error/20 bg-error/5 p-6 text-center">
                <p className="text-error font-medium">Failed to load profile</p>
                <p className="text-sm text-dark-muted mt-1">{profileError}</p>
                <button
                  onClick={refreshProfile}
                  className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <StatsCards profile={profile} completion={completion} />
            )}
          </motion.div>
        );

      case 'profile':
        return (
          <motion.div
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <DashboardHeader
              title="My Profile"
              subtitle="Your complete profile information"
              onMobileMenuOpen={() => setMobileOpen(true)}
              actions={
                <button
                  onClick={() => setActiveView('edit')}
                  className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500 transition-colors"
                >
                  Edit Profile
                </button>
              }
            />
            {profileLoading ? (
              <DashboardSkeleton />
            ) : (
              <ProfileCard profile={profile} />
            )}
          </motion.div>
        );

      case 'edit':
        return (
          <motion.div
            key="edit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="max-w-2xl space-y-6"
          >
            <DashboardHeader
              title="Edit Profile"
              subtitle="Update your personal and academic information"
              onMobileMenuOpen={() => setMobileOpen(true)}
            />
            <ProfileForm
              profile={profile}
              onSave={handleProfileUpdate}
              saving={saving}
              error={formError}
            />
          </motion.div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <DashboardHeader
              title="Settings"
              subtitle="Account settings and preferences"
              onMobileMenuOpen={() => setMobileOpen(true)}
            />
            <PlaceholderView icon={Settings} title="Settings" subtitle="Account settings and preferences" />
          </div>
        );

      case 'resume':
        return (
          <div className="space-y-6">
            <DashboardHeader
              title="Resume"
              subtitle="Manage your resume documents"
              onMobileMenuOpen={() => setMobileOpen(true)}
            />
            <PlaceholderView icon={FileText} title="Resume" subtitle="Manage your resume documents" />
          </div>
        );

      case 'activity':
        return (
          <div className="space-y-6">
            <DashboardHeader
              title="Activity"
              subtitle="Your recent activity and history"
              onMobileMenuOpen={() => setMobileOpen(true)}
            />
            <PlaceholderView icon={Activity} title="Activity" subtitle="Your recent activity and history" />
          </div>
        );

      case 'help':
        return (
          <div className="space-y-6">
            <DashboardHeader
              title="Help"
              subtitle="Get help and support"
              onMobileMenuOpen={() => setMobileOpen(true)}
            />
            <PlaceholderView icon={HelpCircle} title="Help" subtitle="Get help and support" />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-dvh bg-dark-background">
      <Sidebar
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

      {/* Toast notification */}
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

function PlaceholderView({ icon: Icon, title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center"
    >
      <div className="rounded-2xl bg-dark-surface-muted p-5 mb-4">
        <Icon className="h-10 w-10 text-dark-muted" />
      </div>
      <h2 className="text-xl font-semibold text-dark-foreground">{title}</h2>
      <p className="text-sm text-dark-muted mt-1">{subtitle}</p>
    </motion.div>
  );
}
