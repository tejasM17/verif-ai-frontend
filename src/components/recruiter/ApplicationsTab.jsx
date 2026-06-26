import ApplicationCard from "./ApplicationCard";
import { STATUS_META } from "./helpers";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "submitted", label: "Submitted" },
  { id: "reviewing", label: "Reviewing" },
  { id: "accepted", label: "Accepted" },
  { id: "rejected", label: "Rejected" },
];

const ICON = (props) => (
  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2} {...props} />
);

export default function ApplicationsTab({
  applications,
  loading,
  error,
  filter,
  onFilterChange,
  total,
  onStatusChange,
  updatingId,
  onRefresh,
}) {
  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">Applications</h2>
          <p className="text-[12px] text-[var(--text-secondary)] mt-1">
            Review incoming applications and move candidates through your pipeline.
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-300 hover:text-white border border-gray-700/50 hover:border-gray-600 transition-colors disabled:opacity-50"
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
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => {
          const isActive = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => onFilterChange(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isActive
                  ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                  : "bg-white/5 text-gray-300 border-gray-700/50 hover:bg-white/10"
              }`}
            >
              {f.label}
              {isActive && typeof total === "number" && f.id !== "all" && (
                <span className="ml-1.5 text-[10px] text-yellow-300/80">{total}</span>
              )}
            </button>
          );
        })}
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-[13px] text-red-300">
          {error}
        </div>
      )}

      {loading && applications.length === 0 ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-[140px] rounded-2xl bg-[var(--surface-4)] border border-[var(--border-soft)] animate-pulse"
            />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-[var(--border-soft)] rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-[var(--surface-4)] flex items-center justify-center mb-4 border border-[var(--border-soft)]">
            <ICON>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </ICON>
          </div>
          <p className="text-white font-medium">
            {filter === "all"
              ? "No applications yet"
              : `No ${STATUS_META[filter]?.label?.toLowerCase() || filter} applications`}
          </p>
          <p className="text-[13px] text-[var(--text-muted)] mt-1.5 max-w-sm">
            {filter === "all"
              ? "When students apply to your company, they'll show up here for review."
              : "Try a different filter to see other candidates."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <ApplicationCard
              key={app.id || app.uid}
              application={app}
              onStatusChange={onStatusChange}
              updating={updatingId === (app.id || app.uid)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
