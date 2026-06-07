import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Inbox,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Moon,
  LogOut,
  User,
  HelpCircle,
  Building2,
} from 'lucide-react';

const navItems = [
  { id: 'inbox', label: 'Inbox', icon: Inbox },
  { id: 'applications', label: 'Applications', icon: LayoutDashboard },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function RecruiterSidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
  activeView,
  onNavigate,
  user,
  onLogoutClick,
}) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') onMobileClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileOpen, onMobileClose]);

  useEffect(() => {
    if (!profileMenuOpen) return;
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setProfileMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [profileMenuOpen]);

  const sidebarContent = (
    <div
      className={`flex h-full flex-col transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="flex h-16 items-center gap-3 px-4 border-b border-dark-border flex-shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 shadow-lg shadow-primary-500/20 flex-shrink-0">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-bold text-dark-foreground whitespace-nowrap"
            >
              Verif<span className="text-primary-400">AI</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                if (mobileOpen) onMobileClose();
              }}
              title={collapsed ? item.label : undefined}
              className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-500/10 text-primary-400'
                  : 'text-dark-muted hover:bg-dark-surface-hover hover:text-dark-foreground'
              } ${collapsed ? 'justify-center px-0' : ''}`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="truncate overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && !collapsed && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute right-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary-500"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              {collapsed && (
                <div className="absolute left-full ml-2 hidden group-hover:block z-50">
                  <div className="whitespace-nowrap rounded-lg bg-dark-surface-muted border border-dark-border px-3 py-1.5 text-xs text-dark-foreground shadow-xl">
                    {item.label}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-dark-border flex-shrink-0">
        <div className={`px-3 py-2 ${collapsed ? 'flex justify-center' : ''}`}>
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center justify-center rounded-lg p-2 text-dark-muted hover:bg-dark-surface-hover hover:text-dark-foreground transition-colors w-full gap-2"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-xs overflow-hidden whitespace-nowrap"
                >
                  Collapse
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className={`flex w-full items-center gap-3 p-3 transition-colors hover:bg-dark-surface-hover ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-primary-500/20 flex-shrink-0">
              {getInitials(user?.recruiter_name || user?.company_name || user?.email)}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -4 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 min-w-0 text-left"
                >
                  <p className="text-sm font-medium text-dark-foreground truncate">
                    {user?.recruiter_name || user?.company_name || 'Recruiter'}
                  </p>
                  <p className="text-xs text-dark-muted truncate">
                    {user?.email || ''}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          <AnimatePresence>
            {profileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className={`absolute bottom-full left-0 mb-2 w-56 rounded-xl border border-dark-border bg-dark-surface shadow-2xl shadow-black/40 overflow-hidden ${
                  collapsed ? 'left-1/2 -translate-x-1/2' : ''
                }`}
                style={{ transformOrigin: 'bottom left' }}
              >
                <div className="p-3 border-b border-dark-border">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                      {getInitials(user?.recruiter_name || user?.company_name || user?.email)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-dark-foreground truncate">
                        {user?.recruiter_name || user?.company_name || 'Recruiter'}
                      </p>
                      <p className="text-xs text-dark-muted truncate">
                        {user?.email || ''}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-1.5">
                  <button
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-dark-foreground hover:bg-dark-surface-hover transition-all duration-150"
                  >
                    <User className="h-4 w-4 flex-shrink-0" />
                    My Profile
                  </button>
                  <button
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-dark-foreground hover:bg-dark-surface-hover transition-all duration-150"
                  >
                    <Building2 className="h-4 w-4 flex-shrink-0" />
                    Company Settings
                  </button>
                  <button
                    onClick={() => {
                      const isDark = document.documentElement.classList.toggle('dark');
                      localStorage.setItem('theme', isDark ? 'dark' : 'light');
                      setProfileMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-dark-foreground hover:bg-dark-surface-hover transition-all duration-150"
                  >
                    <Moon className="h-4 w-4 flex-shrink-0" />
                    Theme Switch
                  </button>
                  <button
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-dark-foreground hover:bg-dark-surface-hover transition-all duration-150"
                  >
                    <HelpCircle className="h-4 w-4 flex-shrink-0" />
                    Help
                  </button>
                  <div className="my-1 border-t border-dark-border" />
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onLogoutClick();
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-error hover:bg-error/10 transition-all duration-150"
                  >
                    <LogOut className="h-4 w-4 flex-shrink-0" />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={onMobileClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          x: mobileOpen ? 0 : -280,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 left-0 z-50 flex bg-dark-surface border-r border-dark-border lg:hidden shadow-2xl"
      >
        {sidebarContent}
      </motion.aside>

      <aside className="hidden lg:flex h-dvh bg-dark-surface border-r border-dark-border flex-shrink-0">
        {sidebarContent}
      </aside>
    </>
  );
}
