/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { listMyJobs, deleteJob } from "../../api/auth";
import { useAuth } from "../../hooks/useAuth";
import JobCard from "./JobCard";

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-4)] p-5 animate-pulse">
      <div className="h-5 w-2/3 bg-white/5 rounded mb-3" />
      <div className="h-3 w-1/3 bg-white/5 rounded mb-4" />
      <div className="flex gap-2">
        <div className="h-5 w-16 bg-white/5 rounded-full" />
        <div className="h-5 w-20 bg-white/5 rounded-full" />
      </div>
    </div>
  );
}

const TAB_FILTERS = [
  { id: "all", label: "All" },
  { id: "open", label: "Open" },
  { id: "closed", label: "Closed" },
];

export default function JobsTab({ showToast, refreshKey, hasCompany, onJobsChanged, onCreateCompany }) {
  const navigate = useNavigate();
  const { userRole, switchRole } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(hasCompany !== false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [deletingId, setDeletingId] = useState(null);
  const [needsRecruiterRole, setNeedsRecruiterRole] = useState(false);
  const [switchingRole, setSwitchingRole] = useState(false);

  const fetchJobs = useCallback(
    async (statusFilter) => {
      setLoading(true);
      setError(null);
      setNeedsRecruiterRole(false);
      try {
        const params =
          statusFilter && statusFilter !== "all" ? { status: statusFilter } : {};
        const res = await listMyJobs(params);
        setJobs(res.data?.items || []);
      } catch (err) {
        const status = err?.response?.status;
        const detail = err?.response?.data?.detail || "Failed to load roles.";
        // If the recruiter gate fired, give the user an in-place way to fix it
        // instead of forcing them to sign out.
        if (status === 403 && userRole !== "recruiter") {
          setNeedsRecruiterRole(true);
        }
        setError(detail);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    },
    [userRole]
  );

  useEffect(() => {
    fetchJobs(filter);
  }, [filter, refreshKey, hasCompany, fetchJobs]);

  const handleEdit = (job) => {
    navigate(`/recruiter/jobs/${job.uid}/edit`);
  };

  const handleDelete = async (job) => {
    if (!window.confirm(`Delete "${job.title}"? This cannot be undone.`)) return;
    setDeletingId(job.uid);
    // Optimistic remove
    const previous = jobs;
    setJobs((curr) => curr.filter((j) => j.uid !== job.uid));
    try {
      await deleteJob(job.uid);
      showToast?.("success", `Deleted "${job.title}".`);
      onJobsChanged?.();
    } catch (err) {
      // Rollback
      setJobs(previous);
      const status = err?.response?.status;
      const detail =
        err?.response?.data?.detail || "Failed to delete role.";
      if (status === 403 && userRole !== "recruiter") {
        setNeedsRecruiterRole(true);
      }
      showToast?.("error", detail);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSwitchToRecruiter = async () => {
    setSwitchingRole(true);
    try {
      await switchRole?.("recruiter");
      showToast?.(
        "success",
        "Switched this account to recruiter mode. Reloading roles..."
      );
      // Re-fetch now that the role is fixed.
      fetchJobs(filter);
    } catch (err) {
      showToast?.(
        "error",
        err?.response?.data?.detail ||
          "Could not switch role. Try signing out and back in."
      );
    } finally {
      setSwitchingRole(false);
    }
  };

  const handleCreate = () => {
    navigate("/recruiter/jobs/new");
  };

  const openCount = jobs.filter((j) => (j.status || "open") === "open").length;

  return (
    <div className="animate-fade-in space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">Roles</h2>
          <p className="text-[12px] text-[var(--text-secondary)] mt-1">
            Create, edit, and close the roles you're hiring for. Students see only roles with status <span className="text-emerald-400">Open</span>.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm bg-yellow-500 text-black hover:bg-yellow-400 transition-colors font-semibold"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Role
        </button>
      </div>

      {/* Filter pills + count */}
      <div className="flex flex-wrap items-center gap-2">
        {TAB_FILTERS.map((f) => {
          const isActive = filter === f.id;
          const count =
            f.id === "all"
              ? jobs.length
              : f.id === "open"
                ? openCount
                : jobs.length - openCount;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isActive
                  ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                  : "bg-white/5 text-gray-300 border-gray-700/50 hover:bg-white/10"
              }`}
            >
              {f.label}
              {!loading && (
                <span className="ml-1.5 text-[10px] opacity-70">{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {needsRecruiterRole && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[13px] text-amber-200 flex flex-wrap items-start gap-3">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <div className="flex-1 min-w-[200px]">
            <p className="font-medium text-amber-100">
              This account isn't tagged as a recruiter.
            </p>
            <p className="mt-1 text-amber-200/80">
              {error ||
                "You can switch this account to recruiter mode to manage roles."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleSwitchToRecruiter}
            disabled={switchingRole}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-amber-500 text-black hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {switchingRole && (
              <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            )}
            {switchingRole ? "Switching..." : "Switch to recruiter mode"}
          </button>
        </div>
      )}

      {!needsRecruiterRole && error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-[13px] text-red-300">
          {error}
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-[var(--border-soft)] rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-[var(--surface-4)] flex items-center justify-center mb-4 border border-[var(--border-soft)]">
            <svg className="w-7 h-7 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.075a2.25 2.25 0 01-2.27 2.246 18.002 18.002 0 01-7.96-2.81m11.23-3.511a18.002 18.002 0 00-7.96-2.81m0 0V6.341c0-1.18.91-2.165 2.09-2.247h.09a2.25 2.25 0 012.25 2.25v.875M15.75 7.094v-1.5a2.25 2.25 0 00-2.25-2.25h-.094a2.25 2.25 0 00-2.25 2.25v1.5" />
            </svg>
          </div>
          <p className="text-white font-medium">
            {filter === "all"
              ? "No roles yet"
              : `No ${filter} roles`}
          </p>
          <p className="text-[13px] text-[var(--text-muted)] mt-1.5 max-w-sm">
            {filter === "all"
              ? "Create your first role to start receiving applications."
              : "Try a different filter, or create a new role."}
          </p>
          {filter === "all" && (
            <>
              {hasCompany === false && onCreateCompany && (
                <button
                  type="button"
                  onClick={onCreateCompany}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 text-[var(--text-secondary)] hover:bg-white/10 border border-[var(--border-soft)] transition-colors text-sm font-medium"
                >
                  Set up your company profile
                </button>
              )}
              <button
                type="button"
                onClick={handleCreate}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Create your first role
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <JobCard
              key={job.uid}
              job={job}
              onEdit={handleEdit}
              onDelete={handleDelete}
              deleting={deletingId === job.uid}
            />
          ))}
        </div>
      )}
    </div>
  );
}