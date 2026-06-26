import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../hooks/useAuth";
import { ProfileProvider } from "../contexts/ProfileContext";
import { SearchProvider } from "../contexts/CompanySearchContext";
import { PaletteProvider, usePalette } from "../contexts/PaletteContext";
import CommandPalette from "./CommandPalette";
import PaletteTrigger from "./PaletteTrigger";

// Command palette is only for the student role — recruiters don't get the
// trigger, the Ctrl/Cmd+K shortcut, or the modal.
function PaletteHotkey({ enabled }) {
  const { togglePalette } = usePalette();
  useEffect(() => {
    if (!enabled) return undefined;
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        togglePalette();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [togglePalette, enabled]);
  return null;
}

function LayoutInner() {
  const { userRole } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const { open, closePalette, paletteEnabled } = usePalette();

  return (
    <div className="app-shell flex">
      <Sidebar
        role={userRole}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />
      <main
        className={`flex-1 ${collapsed ? "ml-16" : "ml-60"} transition-[margin] duration-300 ease-in-out min-h-screen`}
      >
        <div className="flex items-center justify-center px-4 sm:px-8 h-20 border-b border-[var(--border-soft)] bg-[var(--surface-1)] sticky top-0 z-30">
          {paletteEnabled ? (
            <PaletteTrigger />
          ) : (
            <h1 className="text-[15px] font-semibold text-white tracking-tight">
              Recruiter Dashboard
            </h1>
          )}
        </div>

        <div className="p-4 sm:p-6 lg:p-10">
          <Outlet />
        </div>
      </main>

      {paletteEnabled && <CommandPalette open={open} onClose={closePalette} />}
    </div>
  );
}

export default function Layout() {
  const { userRole } = useAuth();
  // Only students get the command palette features.
  const paletteEnabled = userRole === "student";

  return (
    <ProfileProvider>
      <SearchProvider>
        <PaletteProvider paletteEnabled={paletteEnabled}>
          <PaletteHotkey enabled={paletteEnabled} />
          <LayoutInner />
        </PaletteProvider>
      </SearchProvider>
    </ProfileProvider>
  );
}