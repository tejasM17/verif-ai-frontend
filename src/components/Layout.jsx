import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../hooks/useAuth";
import { ProfileProvider } from "../contexts/ProfileContext";

export default function Layout() {
  const { userRole } = useAuth();

  return (
    <ProfileProvider>
      <div className="min-h-screen bg-[#0f0f0f]">
        <Sidebar role={userRole} />
        <main className="ml-60">
          {/* Header */}
          <header className="h-16 flex items-center justify-center px-8 border-b border-gray-800/50">
            <div className="relative w-full max-w-xl">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Search companies, roles..."
                className="w-full h-10 pl-10 pr-4 bg-[#1a1a1a] border border-gray-700/50 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/20 transition-all duration-200"
              />
            </div>
          </header>

          {/* Content */}
          <div className="p-6">
            <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800/50 min-h-[calc(100vh-5.5rem)]">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </ProfileProvider>
  );
}
