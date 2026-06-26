import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { myApplications } from "../api/auth";

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

function initialsOf(name) {
  if (!name) return "C";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function truncate(str, n) {
  if (!str) return "";
  if (str.length <= n) return str;
  return str.slice(0, n) + "...";
}

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "submitted", label: "Submitted" },
  { value: "reviewing", label: "Reviewing" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
];

const STATUS_BADGE = {
  submitted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  reviewing: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  accepted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
};

function StatusBadge({ status }) {
  if (!status) return null;
  const cls = STATUS_BADGE[status] || "bg-gray-500/10 text-gray-400 border-gray-500/20";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-medium border ${cls}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-[var(--surface-4)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/5 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 bg-white/5 rounded" />
          <div className="h-3 w-1/2 bg-white/5 rounded" />
          <div className="h-3 w-2/3 bg-white/5 rounded" />
        </div>
        <div className="hidden sm:block w-16 h-5 bg-white/5 rounded-full" />
      </div>
    </div>
  );
}

export default function StudentAppliedCompanies() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  // Status counts for the filter pills
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    submitted: 0,
    reviewing: 0,
    accepted: 0,
    rejected: 0,
  });
  const [countsLoading, setCountsLoading] = useState(true);

  // Fetch applications for the current filter
  const fetchApplications = useCallback(async (statusFilter) => {
    setLoading(true);
    setError(null);
    try {
      const params = statusFilter && statusFilter !== "all" ? { status: statusFilter, limit: 100 } : { limit: 100 };
      const res = await myApplications(params);
      const items = res.data?.items || [];
      setApplications(items);
      setTotal(res.data?.total ?? items.length);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to load applications.");
      setApplications([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch counts per status (for the pills)
  const refreshStatusCounts = useCallback(async () => {
    setCountsLoading(true);
    try {
      const responses = await Promise.all([
        myApplications({ status: "submitted", limit: 1 }),
        myApplications({ status: "reviewing", limit: 1 }),
        myApplications({ status: "accepted", limit: 1 }),
        myApplications({ status: "rejected", limit: 1 }),
      ]);
      const counts = {
        submitted: responses[0]?.data?.total ?? 0,
        reviewing: responses[1]?.data?.total ?? 0,
        accepted: responses[2]?.data?.total ?? 0,
        rejected: responses[3]?.data?.total ?? 0,
      };
      counts.all = counts.submitted + counts.reviewing + counts.accepted + counts.rejected;
      setStatusCounts(counts);
    } catch {
      // Non-fatal
    } finally {
      setCountsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications(filter);
  }, [filter, fetchApplications]);

  useEffect(() => {
    refreshStatusCounts();
  }, [refreshStatusCounts]);

  const isStudent = !user || user.role === "student";

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 animate-fade-in">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-white text-sm mb-6 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back
      </button>

      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Your Applications</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          {loading && !countsLoading ? (
            "Loading applications..."
          ) : (
            <>
              {total} {total === 1 ? "application" : "applications"}
              {filter !== "all" && ` with status "${filter}"`}
            </>
          )}
        </p>
      </header>

      {/* Status filter pills */}
      <div className="mb-6 -mx-4 sm:mx-0 overflow-x-auto">
        <div className="flex gap-2 px-4 sm:px-0 sm:flex-wrap">
          {STATUS_FILTERS.map((f) => {
            const count = statusCounts[f.value] ?? 0;
            const isActive = filter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                disabled={countsLoading && f.value !== "all"}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] border-[var(--accent-gold)]/30"
                    : "bg-white/[0.02] text-[var(--text-secondary)] border-[var(--border-soft)] hover:text-white hover:border-white/10"
                }`}
              >
                <span>{f.label}</span>
                <span
                  className={`inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-[10px] font-semibold ${
                    isActive
                      ? "bg-[var(--accent-gold)]/20 text-[var(--accent-gold)]"
                      : "bg-white/5 text-[var(--text-muted)]"
                  }`}
                >
                  {countsLoading ? "..." : count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-300 mb-6">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="space-y-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* Empty state — no applications at all */}
      {!loading && !error && applications.length === 0 && filter === "all" && (
        <div className="bg-[var(--surface-4)] border border-[var(--border-soft)] rounded-2xl p-10 sm:p-14 flex flex-col items-center text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/20 flex items-center justify-center mb-5">
            <svg
              className="w-7 h-7 text-[var(--accent-gold)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 14.15v4.075a2.25 2.25 0 01-2.27 2.246 18.002 18.002 0 01-7.96-2.81m11.23-3.511a18.002 18.002 0 00-7.96-2.81m0 0V6.341c0-1.18.91-2.165 2.09-2.247h.09a2.25 2.25 0 012.25 2.25v.875M15.75 7.094v-1.5a2.25 2.25 0 00-2.25-2.25h-.094a2.25 2.25 0 00-2.25 2.25v1.5"
              />
            </svg>
          </div>
          <h2 className="text-white text-lg font-semibold">No applications yet</h2>
          <p className="text-[var(--text-secondary)] text-sm mt-1 max-w-sm">
            Browse companies and apply to get started.
          </p>
          {isStudent && (
            <button
              onClick={() => navigate("/student")}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-[var(--accent-gold)] text-black hover:brightness-95 active:brightness-90 transition-all"
            >
              Browse Companies
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Empty state — filter shows zero results */}
      {!loading && !error && applications.length === 0 && filter !== "all" && (
        <div className="bg-[var(--surface-4)] border border-[var(--border-soft)] rounded-2xl p-10 flex flex-col items-center text-center animate-fade-in">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-[var(--border-soft)] flex items-center justify-center mb-4">
            <svg
              className="w-5 h-5 text-[var(--text-muted)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
          <p className="text-white text-sm font-medium">
            No applications with status "{filter}"
          </p>
          <button
            onClick={() => setFilter("all")}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-[var(--accent-gold)] bg-[var(--accent-gold)]/10 hover:bg-[var(--accent-gold)]/20 border border-[var(--accent-gold)]/20 transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear filter
          </button>
        </div>
      )}

      {/* Application cards */}
      {!loading && !error && applications.length > 0 && (
        <div className="space-y-3">
          {applications.map((app) => {
            const initials = initialsOf(app.company_name);
            const logoUrl = app.company_logo_url;
            const subtitle = app.job_title || "Company-wide application";
            const excerpt = app.why_appoint ? truncate(app.why_appoint, 120) : null;
            const applied = timeAgo(app.created_at);

            return (
              <button
                key={app.id}
                onClick={() => navigate(`/student/application/${app.id}`)}
                className="w-full text-left bg-[var(--surface-4)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5 hover:border-[var(--accent-gold)]/30 hover:bg-[var(--surface-5)] transition-all group"
              >
                <div className="flex items-center gap-4">
                  {/* Logo */}
                  <div className="w-12 h-12 rounded-xl flex-shrink-0 overflow-hidden bg-[var(--accent-gold)] flex items-center justify-center text-black font-bold text-base">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={app.company_name || "Company"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      initials
                    )}
                  </div>

                  {/* Center content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <h3 className="text-white font-semibold text-sm sm:text-base truncate">
                        {app.company_name || "Unknown company"}
                      </h3>
                      <StatusBadge status={app.status} />
                    </div>
                    <p className="text-[var(--text-secondary)] text-xs sm:text-sm truncate">
                      {subtitle}
                    </p>
                    {excerpt && (
                      <p className="text-[var(--text-muted)] text-xs mt-1.5 line-clamp-2">
                        "{excerpt}"
                      </p>
                    )}
                    {applied && (
                      <p className="text-[var(--text-muted)] text-[11px] mt-1.5">
                        Applied {applied}
                      </p>
                    )}
                  </div>

                  {/* Right chevron + hint */}
                  <div className="hidden sm:flex flex-col items-end gap-1 flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-gold)] transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                    <span className="text-[10px] text-[var(--text-muted)] group-hover:text-[var(--accent-gold)] transition-colors">
                      View details
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}