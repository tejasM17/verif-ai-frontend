import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useAuth } from '../hooks/useAuth';
import {
  LogOut,
  User,
  ShieldCheck,
  LayoutDashboard,
  Search,
  FileText,
  Bell,
  CheckCircle2,
  Settings,
  Menu,
  X,
  Home,
  Briefcase,
  Star
} from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 lg:p-8">
        <Link to="/home" className="flex items-center space-x-3 group">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">VERIF-AI</span>
        </Link>
      </div>

      <nav className="flex-grow px-4 lg:px-4 space-y-1.5">
        {user?.role === 'student' ? (
          <>
            <Link to="/home" className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Briefcase className="h-5 w-5" />
              <span className="font-medium">Job Search</span>
            </Link>
            <Link to="/dashboard" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all">
              <LayoutDashboard className="h-5 w-5" />
              <span className="font-medium">My Verification</span>
            </Link>
            <Link to="/documents" className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all">
              <FileText className="h-5 w-5" />
              <span className="font-medium">My Documents</span>
            </Link>
          </>
        ) : (
          <>
            <Link to="/recruiter-home" className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <LayoutDashboard className="h-5 w-5" />
              <span className="font-medium">Applications</span>
            </Link>
            <Link to="/discover" className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all">
              <Search className="h-5 w-5" />
              <span className="font-medium">Discover</span>
            </Link>
            <Link to="/shortlist" className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all">
              <Star className="h-5 w-5" />
              <span className="font-medium">Shortlist</span>
            </Link>
          </>
        )}

        <div className="pt-4 mt-4 border-t border-gray-100">
          <Link to="/settings" className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all">
            <Settings className="h-5 w-5" />
            <span className="font-medium">Settings</span>
          </Link>
        </div>
      </nav>

      <div className="p-4 lg:p-6 border-t border-gray-100">
        <div className="glass-card p-4 rounded-2xl flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 flex-shrink-0">
            {user?.display_name?.charAt(0) || 'U'}
          </div>
          <div className="flex-grow overflow-hidden hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.display_name}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 text-gray-900 flex">
      {/* Desktop Sidebar */}
      <aside className="w-72 glass-sidebar flex flex-col fixed inset-y-0 left-0 shadow-xl">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="w-72 glass-sidebar flex flex-col fixed inset-y-0 left-0 z-50 lg:hidden animate-slide-in-right">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <Link to="/dashboard" className="flex items-center space-x-3 group">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight text-gray-900">VERIF-AI</span>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-grow overflow-y-auto">
              <SidebarContent />
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="flex-grow flex flex-col lg:ml-72">
        {/* Top Header */}
        <header className="h-16 lg:h-20 border-b border-gray-200/80 bg-white/80 backdrop-blur-md px-4 lg:px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-gray-400 hidden sm:block">Pages</span>
            <span className="text-gray-400 hidden sm:block">/</span>
            <span className="text-gray-900 font-medium">Dashboard</span>
          </div>

          <div className="flex items-center space-x-4 lg:space-x-6">
            <button className="relative p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-blue-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full hidden sm:flex">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-tighter">System Live</span>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <div
                className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 border border-white cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {user?.display_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 glass-card rounded-2xl py-2 z-50 animate-fade-slide-up">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user?.display_name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => { setIsDropdownOpen(false); navigate('/settings'); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors text-sm"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={() => { setIsDropdownOpen(false); handleLogout(); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 flex-grow">
          {children}
        </main>

        <footer className="p-4 lg:p-8 border-t border-gray-200/50 text-center text-gray-400 text-xs bg-white/50">
          © {new Date().getFullYear()} VERIF-AI Intelligence. All assets secured by Blockchain Verification.
        </footer>
      </div>
    </div>
  );
};

export default Layout;