import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, LogOut, User, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const TopNav: React.FC = () => {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get initials from display name or email
  const getInitials = () => {
    if (user?.display_name) {
      return user.display_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/login');
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/80 px-6 py-3 flex items-center justify-between shadow-sm">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
          <ShieldCheck className="w-4 h-4 text-white" />
        </div>
        <span className="text-indigo-600 font-bold text-xl tracking-tight">VERIF-AI</span>
        <div className="w-px h-4 bg-slate-200 mx-1" />
        <span className="text-slate-400 text-sm font-medium">Student Portal</span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Bell */}
        <div className="relative cursor-pointer group">
          <div className="w-9 h-9 rounded-full hover:bg-slate-100 transition-colors flex items-center justify-center">
            <Bell className="w-5 h-5 text-slate-500 group-hover:text-indigo-500 transition-colors" />
          </div>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </div>

        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2.5 cursor-pointer group hover:bg-slate-100 rounded-full pl-1 pr-3 py-1 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
              {getInitials()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
                {user?.display_name || user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-[10px] text-slate-400 capitalize">{user?.role || 'student'}</p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-slide-up">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {user?.display_name || 'User'}
                </p>
                <p className="text-xs text-slate-400 truncate mt-0.5">{user?.email}</p>
              </div>
              <button
                onClick={() => { setDropdownOpen(false); navigate('/student'); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors text-sm"
              >
                <User className="w-4 h-4" />
                <span>Verification Dashboard</span>
              </button>
              <div className="border-t border-slate-100 my-1" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
