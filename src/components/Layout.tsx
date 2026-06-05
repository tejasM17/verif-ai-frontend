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
  CheckCircle2
} from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0f0f12] border-r border-white/5 flex flex-col hidden lg:flex">
        <div className="p-8">
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="p-2 bg-blue-600 rounded-xl group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">VERIF-AI</span>
          </Link>
        </div>

        <nav className="flex-grow px-4 space-y-2">
          <Link to="/dashboard" className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-blue-600/10 text-blue-500 border border-blue-500/20">
            <LayoutDashboard className="h-5 w-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-white/5 hover:text-white transition-all">
            <FileText className="h-5 w-5" />
            <span className="font-medium">My Documents</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-white/5 hover:text-white transition-all">
            <Search className="h-5 w-5" />
            <span className="font-medium">Discovery</span>
          </button>
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="bg-[#16161a] p-4 rounded-2xl border border-white/5 flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
              {user?.display_name?.charAt(0) || 'U'}
            </div>
            <div className="flex-grow overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.display_name}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">{user?.role}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-500 transition-colors"
            >
              <LogOut className="h-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 bg-[#0a0a0c]/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Pages</span>
            <span className="text-gray-500">/</span>
            <span className="text-white font-medium">Dashboard</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-blue-500 rounded-full border-2 border-[#0a0a0c]" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-tighter">System Live</span>
            </div>
          </div>
        </header>

        <main className="p-8 flex-grow">
          {children}
        </main>

        <footer className="p-8 border-t border-white/5 text-center text-gray-600 text-xs">
          © {new Date().getFullYear()} VERIF-AI Intelligence. All assets secured by Blockchain Verification.
        </footer>
      </div>
    </div>
  );
};

export default Layout;
