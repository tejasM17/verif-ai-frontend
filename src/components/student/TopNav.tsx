import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';

const TopNav: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 w-full glass-card border-b border-slate-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-indigo-600 font-bold text-xl tracking-tight">VERIF-AI</span>
        <div className="w-px h-4 bg-slate-300 mx-1" />
        <span className="text-slate-400 text-sm font-medium">Student Portal</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer group">
          <Bell className="w-5 h-5 text-slate-500 group-hover:text-indigo-500 transition-colors" />
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:shadow-md transition-shadow">
            PS
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
