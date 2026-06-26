import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

/**
 * Inline banner shown when the dashboard detects the logged-in user isn't
 * actually tagged as a recruiter (e.g. role=None from a legacy signup, or
 * a student trying to access the recruiter dashboard).
 *
 * Offers a one-click "Switch to recruiter mode" recovery path that calls
 * PUT /profile/role via the AuthContext, then notifies the parent so the
 * gated calls can be re-issued.
 */
export default function RoleGateBanner({ detail, onRecovered }) {
  const { switchRole } = useAuth();
  const [busy, setBusy] = useState(false);

  const handleSwitch = async () => {
    setBusy(true);
    try {
      await switchRole?.("recruiter");
      onRecovered?.();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mb-5 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[13px] text-amber-200 flex flex-wrap items-start gap-3 animate-fade-in">
      <svg
        className="w-4 h-4 mt-0.5 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>
      <div className="flex-1 min-w-[200px]">
        <p className="font-medium text-amber-100">
          This account isn't tagged as a recruiter.
        </p>
        <p className="mt-1 text-amber-200/80">
          {detail ||
            "Switch this account to recruiter mode to manage your company profile and roles."}
        </p>
      </div>
      <button
        type="button"
        onClick={handleSwitch}
        disabled={busy}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-amber-500 text-black hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {busy && (
          <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
        )}
        {busy ? "Switching..." : "Switch to recruiter mode"}
      </button>
    </div>
  );
}
