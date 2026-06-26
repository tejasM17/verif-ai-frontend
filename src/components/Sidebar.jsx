import { useState, useRef, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../contexts/ProfileContext";
import { getPhotoUrl } from "../api/auth";

const studentNavItems = [
  { to: "/student", label: "Home", icon: "home", end: true },
  { to: "/student/applied", label: "Applied Companies", icon: "clipboard" },
  { to: "/student/profile", label: "My Profile", icon: "user" },
  { to: "/student/settings", label: "Settings", icon: "cog" },
];

const recruiterNavItems = [
  { to: "/recruiter", label: "Dashboard", icon: "chart", end: true },
  { to: "/recruiter/profile", label: "My Profile", icon: "user" },
  { to: "/recruiter/settings", label: "Settings", icon: "cog" },
];

function NavIcon({ name, className = "w-5 h-5" }) {
  const common = {
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (name) {
    case "home":
      return (
        <svg {...common} className={className}>
          <path d="M2.25 12l9-9 9 9M4.5 10.5v9.75A1.5 1.5 0 006 21.75h3v-6h6v6h3a1.5 1.5 0 001.5-1.5V10.5" />
        </svg>
      );
    case "clipboard":
      return (
        <svg {...common} className={className}>
          <path d="M9 4.5h6a1.5 1.5 0 011.5 1.5V18a1.5 1.5 0 01-1.5 1.5H9A1.5 1.5 0 017.5 18V6A1.5 1.5 0 019 4.5z" />
          <path d="M9 4.5V3.75A1.5 1.5 0 0110.5 2.25h3A1.5 1.5 0 0115 3.75V4.5" />
          <path d="M9 9.75h6M9 12.75h6M9 15.75h4" />
        </svg>
      );
    case "user":
      return (
        <svg {...common} className={className}>
          <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          <path d="M4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      );
    case "cog":
      return (
        <svg {...common} className={className}>
          <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common} className={className}>
          <path d="M3 3v18h18" />
          <path d="M7 14.5l3-3 3 3 5-6" />
        </svg>
      );
    default:
      return null;
  }
}

function NavSection({ items, collapsed }) {
  return (
    <nav className="flex flex-col gap-1 px-2 mt-2">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          title={collapsed ? item.label : undefined}
          className={({ isActive }) =>
            `flex items-center border-l-2 rounded-lg py-2.5 px-3 gap-3 transition-all duration-200 text-sm ${
              collapsed ? "justify-center" : ""
            } ${
              isActive
                ? "text-white bg-[var(--accent-gold)]/10 border-[var(--accent-gold)]"
                : "text-gray-300 hover:text-white hover:bg-white/5 border-transparent"
            }`
          }
        >
          <NavIcon name={item.icon} className="w-5 h-5 flex-shrink-0" />
          <span
            className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            {item.label}
          </span>
        </NavLink>
      ))}
    </nav>
  );
}

export default function Sidebar({ role, collapsed, onToggle }) {
  const [showPopup, setShowPopup] = useState(false);
  const { user, logout } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const popupRef = useRef(null);

  const photoUrl = getPhotoUrl(profile?.photo_url);
  const isCollapsed = !!collapsed;

  useEffect(() => {
    if (isCollapsed) setShowPopup(false);
  }, [isCollapsed]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full ${
        isCollapsed ? "w-16" : "w-60"
      } bg-[#0f0f0f] flex flex-col z-50 transition-[width] duration-300 ease-in-out`}
    >
      {/* Top: Menu Icon + Logo */}
      <div
        className={`flex items-center h-16 ${
          isCollapsed ? "justify-center px-2" : "justify-between px-4"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-yellow-400 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span
            className={`text-lg font-bold text-white tracking-tight whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            VerifAI
          </span>
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`flex items-center justify-center w-8 h-8 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 flex-shrink-0 ${
            isCollapsed ? "" : "ml-1"
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
            />
          </svg>
        </button>
      </div>

      {/* Nav */}
      <NavSection
        items={role === "recruiter" ? recruiterNavItems : studentNavItems}
        collapsed={isCollapsed}
      />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Profile at Bottom */}
      <div
        className={`relative ${isCollapsed ? "px-2" : "px-3"} pb-4`}
        ref={popupRef}
      >
        {/* Profile Popup */}
        {showPopup && !isCollapsed && (
          <div className="absolute bottom-full left-3 mb-2 w-56 bg-[#1a1a1a] rounded-xl border border-gray-700/50 shadow-2xl overflow-hidden animate-slide-down">
            {/* Profile Header */}
            <div className="p-4 border-b border-gray-700/50">
              <div className="flex items-center gap-3">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-black font-semibold text-sm">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <div>
                  <p className="text-white font-medium text-sm">
                    {user?.name || "User"}
                  </p>
                  <p className="text-gray-400 text-xs truncate max-w-[140px]">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <button
                onClick={() => {
                  setShowPopup(false);
                  navigate(`/${role}/profile`);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 text-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
                My Profile
              </button>
              <button
                onClick={() => {
                  setShowPopup(false);
                  navigate(`/${role}/settings`);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 text-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Settings
              </button>
            </div>

            {/* Logout */}
            <div className="p-2 border-t border-gray-700/50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-400/10 transition-all duration-200 text-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                  />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Profile Button */}
        <button
          onClick={() => {
            if (isCollapsed) {
              onToggle();
              return;
            }
            setShowPopup(!showPopup);
          }}
          className={`w-full flex items-center ${
            isCollapsed ? "justify-center" : "gap-3"
          } px-3 py-2.5 rounded-xl bg-[#1a1a1a] hover:bg-[#222222] transition-all duration-200`}
          aria-label={isCollapsed ? "Expand sidebar" : "Open profile menu"}
        >
          <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden">
            {photoUrl ? (
              <img src={photoUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-yellow-400 flex items-center justify-center text-black font-semibold text-sm">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>
          <div
            className={`flex-1 min-w-0 text-left overflow-hidden transition-all duration-300 ease-in-out ${
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            <p className="text-sm font-medium text-white truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
          {!isCollapsed && (
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                showPopup ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 15.75l7.5-7.5 7.5 7.5"
              />
            </svg>
          )}
        </button>
      </div>
    </aside>
  );
}