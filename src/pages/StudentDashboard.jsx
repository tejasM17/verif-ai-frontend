import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCompanySearch } from "../contexts/CompanySearchContext";
import { myApplications } from "../api/auth";

function initials(name) {
  if (!name) return "C";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function timeAgo(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

const STATUS_STYLES = {
  submitted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  reviewing: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  accepted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
};

function FeedRow({ company, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(company)}
      className="command-row w-full flex items-center gap-4 px-4 sm:px-5 py-4 sm:py-5 rounded-xl border border-[var(--border-soft)] bg-[var(--surface-4)] hover:bg-[var(--surface-5)] text-left"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-blue)] to-[#1d4ed8] flex items-center justify-center text-white font-semibold flex-shrink-0">
        {initials(company.company_name)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[16px] sm:text-[17px] font-semibold text-white truncate">
          {company.company_name}
        </p>
        <p className="mt-0.5 text-[12px] sm:text-[13px] text-[var(--text-secondary)] truncate">
          {company.industry || "Company"}
          {company.location ? ` · ${company.location}` : ""}
        </p>
      </div>
      <div className="hidden sm:flex flex-col items-end gap-1 flex-shrink-0">
        {company.role && (
          <span className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] border border-[var(--border-medium)] rounded-full px-2 py-0.5">
            Hiring
          </span>
        )}
        <span className="text-[11px] text-[var(--text-muted)]">View profile</span>
      </div>
      <svg
        className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0 hidden sm:block"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </button>
  );
}

function ApplicationCard({ app, onClick }) {
  const statusKey = (app.status || "submitted").toLowerCase();
  const statusStyle = STATUS_STYLES[statusKey] || STATUS_STYLES.submitted;

  return (
    <button
      type="button"
      onClick={() => onClick?.(app)}
      className="bg-[var(--surface-4)] border border-[var(--border-soft)] rounded-xl p-4 hover:bg-[var(--surface-5)] transition-colors cursor-pointer text-left w-full"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-yellow-400 text-black font-semibold flex items-center justify-center flex-shrink-0">
          {initials(app.company_name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-white truncate">
            {app.company_name}
          </p>
          <p className="mt-0.5 text-[12px] text-[var(--text-secondary)] truncate">
            {app.job_title || app.company_role || "Application"}
          </p>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span
              className={`text-[10px] uppercase tracking-wider border rounded-full px-2 py-0.5 ${statusStyle}`}
            >
              {app.status || "submitted"}
            </span>
            {app.created_at && (
              <span className="text-[11px] text-[var(--text-muted)]">
                {timeAgo(app.created_at)}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

export default function StudentDashboard() {
  const { query, results, feed, total, feedTotal, loading, error, reloadFeed } = useCompanySearch();
  const navigate = useNavigate();

  const [myApps, setMyApps] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [appsError, setAppsError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setAppsLoading(true);
    setAppsError(null);
    myApplications({ limit: 4, skip: 0 })
      .then((res) => {
        if (cancelled) return;
        const items = res?.data?.items || [];
        setMyApps(items.slice(0, 4));
      })
      .catch((err) => {
        if (cancelled) return;
        setAppsError(
          err?.response?.data?.detail || err?.message || "Failed to load applications"
        );
        setMyApps([]);
      })
      .finally(() => {
        if (!cancelled) setAppsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const isSearching = query.trim().length > 0;
  const list = isSearching ? results : feed;
  const heading = isSearching ? "Search Results" : "Companies Hiring Now";
  const subtitle = isSearching
    ? `${total} match${total === 1 ? "" : "es"} for "${query}"`
    : `${feedTotal} compan${feedTotal === 1 ? "y" : "ies"} on VerifAI`;

  return (
    <div className="p-5 sm:p-8 lg:p-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-3 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{heading}</h1>
            <p className="text-[13px] text-[var(--text-secondary)] mt-1.5">{subtitle}</p>
          </div>
          {!isSearching && (
            <button
              type="button"
              onClick={reloadFeed}
              className="text-[12px] text-[var(--text-secondary)] hover:text-white transition-colors flex items-center gap-1.5"
            >
              <svg
                className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              Refresh
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-[13px] text-red-300">
            {error}
          </div>
        )}

        {loading && list.length === 0 ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-[72px] rounded-xl bg-[var(--surface-4)] border border-[var(--border-soft)] animate-pulse"
              />
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-[var(--border-soft)] rounded-2xl">
            <div className="w-14 h-14 rounded-full bg-[var(--surface-4)] flex items-center justify-center mb-4 border border-[var(--border-soft)]">
              <svg
                className="w-6 h-6 text-[var(--text-muted)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
            <p className="text-white font-medium text-[15px]">
              {isSearching ? `No results for "${query}"` : "No companies yet"}
            </p>
            <p className="text-[13px] text-[var(--text-muted)] mt-1.5 max-w-sm">
              {isSearching
                ? "Try a different company name, role, or location."
                : "Recruiters can publish their company profile from the recruiter dashboard."}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {list.map((company) => (
              <FeedRow
                key={company.uid}
                company={company}
                onClick={(c) => navigate(`/student/company/${c.uid}`)}
              />
            ))}
          </div>
        )}

        {/* Your Applications section */}
        <div className="mt-10 mb-4 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-white">Your Applications</h2>
            <span className="text-[11px] text-[var(--text-secondary)] border border-[var(--border-soft)] rounded-full px-2 py-0.5">
              {myApps.length} total
            </span>
          </div>
          {myApps.length >= 4 && (
            <button
              type="button"
              onClick={() => navigate("/student/applied")}
              className="text-[12px] text-[var(--text-secondary)] hover:text-white transition-colors"
            >
              View all
            </button>
          )}
        </div>

        {appsError && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-[13px] text-red-300">
            {appsError}
          </div>
        )}

        {appsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[112px] rounded-xl bg-[var(--surface-4)] border border-[var(--border-soft)] animate-pulse"
              />
            ))}
          </div>
        ) : myApps.length === 0 ? (
          <div className="flex items-center gap-3 p-4 bg-[var(--surface-4)] border border-dashed border-[var(--border-soft)] rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-[var(--surface-5)] flex items-center justify-center flex-shrink-0 border border-[var(--border-soft)]">
              <svg
                className="w-4 h-4 text-[var(--text-muted)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <p className="text-[13px] text-[var(--text-secondary)]">
              You haven't applied to any companies yet. Browse the list above to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {myApps.map((app) => (
              <ApplicationCard
                key={app.id}
                app={app}
                onClick={(a) => navigate(`/student/application/${a.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}