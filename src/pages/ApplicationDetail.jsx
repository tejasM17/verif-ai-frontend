import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getApplication,
  getCompany,
  getCompanyLogoUrl,
  getResumeDownloadUrl,
  deleteApplication,
} from "../api/auth";

function initials(name) {
  if (!name) return "C";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const STATUS_STYLES = {
  submitted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  reviewing: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  accepted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
};

const STATUS_DOT = {
  submitted: "bg-blue-400",
  reviewing: "bg-amber-400",
  accepted: "bg-emerald-400",
  rejected: "bg-red-400",
};

function formatDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateTime(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })} · ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
}

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || "bg-white/5 text-gray-300 border-[var(--border-soft)]";
  const dot = STATUS_DOT[status] || "bg-gray-400";
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown";
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-semibold border ${style}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

export default function ApplicationDetail() {
  const { appId } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logoFailed, setLogoFailed] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setLogoFailed(false);

    getApplication(appId)
      .then((res) => {
        if (cancelled) return;
        const data = res.data || null;
        setApplication(data);
        if (data?.company_uid) {
          getCompany(data.company_uid)
            .then((cRes) => {
              if (!cancelled) setCompany(cRes.data || null);
            })
            .catch(() => {
              if (!cancelled) setCompany(null);
            });
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.response?.data?.detail || "Application not found.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [appId]);

  const handleWithdraw = async () => {
    if (!window.confirm("Are you sure you want to withdraw your application?")) return;
    setWithdrawing(true);
    try {
      await deleteApplication(appId);
      navigate("/student/applied");
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to withdraw application.");
      setWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-6 sm:py-10 px-4 sm:px-6 animate-fade-in">
        <div className="h-4 w-32 bg-white/5 rounded mb-6 animate-pulse" />
        <div className="bg-[var(--surface-4)] border border-[var(--border-soft)] rounded-2xl p-6 sm:p-8 animate-pulse">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/5" />
            <div className="flex-1 space-y-3">
              <div className="h-6 w-1/2 bg-white/5 rounded" />
              <div className="h-4 w-1/3 bg-white/5 rounded" />
              <div className="h-6 w-24 bg-white/5 rounded-full mt-2" />
            </div>
          </div>
        </div>
        <div className="h-40 mt-6 bg-[var(--surface-4)] border border-[var(--border-soft)] rounded-2xl animate-pulse" />
        <div className="h-40 mt-6 bg-[var(--surface-4)] border border-[var(--border-soft)] rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="max-w-3xl mx-auto py-6 sm:py-10 px-4 sm:px-6 animate-fade-in">
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
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Applied Companies
        </button>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-300">
          {error || "Application not found."}
        </div>
      </div>
    );
  }

  const {
    company_uid,
    company_name,
    job_title,
    why_appoint,
    resume_uid,
    status,
    status_history,
    created_at,
  } = application;

  const displayCompanyName = company?.company_name || company_name || "Company";
  const companyInitial = initials(displayCompanyName);
  const logoUrl =
    company?.logo_url && !logoFailed ? company.logo_url : getCompanyLogoUrl(company_uid);

  const appliedLabel = formatDate(created_at) || "Date unknown";
  const history = Array.isArray(status_history) ? [...status_history].reverse() : [];

  const canWithdraw = status === "submitted" || status === "reviewing";

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 px-4 sm:px-6 animate-fade-in">
      {/* Back button */}
      <button
        onClick={() => navigate("/student/applied")}
        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-white text-sm mb-6 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to Applied Companies
      </button>

      {/* Header card */}
      <section className="bg-[var(--surface-4)] border border-[var(--border-soft)] rounded-2xl overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-amber-900/60 via-amber-800/40 to-amber-950/30" />
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5 sm:gap-6 -mt-10">
            <div className="w-20 h-20 rounded-2xl border-4 border-[var(--surface-4)] bg-[var(--surface-3)] flex items-center justify-center overflow-hidden flex-shrink-0">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={displayCompanyName}
                  className="w-full h-full object-cover"
                  onError={() => setLogoFailed(true)}
                />
              ) : (
                <div className="w-full h-full bg-[var(--accent-gold)] flex items-center justify-center text-black font-bold text-2xl">
                  {companyInitial}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <h1 className="text-xl sm:text-2xl font-bold text-white break-words">
                {displayCompanyName}
              </h1>
              <p className="text-[13px] text-[var(--text-secondary)] mt-1">Applied on {appliedLabel}</p>
              <div className="mt-3">
                <StatusBadge status={status} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job you applied to */}
      <section className="mt-5 bg-[var(--surface-4)] border border-[var(--border-soft)] rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-5 rounded-full bg-[var(--accent-gold)]" />
          <h2 className="text-[15px] font-semibold text-white">Job you applied to</h2>
        </div>
        {job_title ? (
          <p className="text-[15px] text-white font-medium">{job_title}</p>
        ) : (
          <>
            <p className="text-[14px] text-white font-medium">Company-wide application</p>
            <p className="text-[12px] text-[var(--text-muted)] mt-1">
              You applied to {displayCompanyName} without targeting a specific role.
            </p>
          </>
        )}
      </section>

      {/* Why you should be hired */}
      <section className="mt-5 bg-[var(--surface-4)] border border-[var(--border-soft)] rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-5 rounded-full bg-[var(--accent-gold)]" />
          <h2 className="text-[15px] font-semibold text-white">Why you should be hired</h2>
        </div>
        {why_appoint ? (
          <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
            {why_appoint}
          </p>
        ) : (
          <p className="text-[13px] text-[var(--text-muted)] italic">No message provided.</p>
        )}
      </section>

      {/* Resume submitted */}
      <section className="mt-5 bg-[var(--surface-4)] border border-[var(--border-soft)] rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-5 rounded-full bg-[var(--accent-gold)]" />
          <h2 className="text-[15px] font-semibold text-white">Resume submitted</h2>
        </div>
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-[var(--surface-3)] border border-[var(--border-soft)]">
          <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">Resume ID</p>
            <p className="text-white text-xs font-mono truncate">{resume_uid || "Not available"}</p>
          </div>
          {resume_uid && (
            <a
              href={getResumeDownloadUrl(resume_uid)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
              Download Resume
            </a>
          )}
        </div>
      </section>

      {/* Status history */}
      <section className="mt-5 bg-[var(--surface-4)] border border-[var(--border-soft)] rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full bg-[var(--accent-gold)]" />
          <h2 className="text-[15px] font-semibold text-white">Status history</h2>
        </div>

        {history.length === 0 ? (
          <p className="text-[13px] text-[var(--text-muted)] italic">No status updates yet.</p>
        ) : (
          <ol className="relative space-y-4">
            <span className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--border-soft)]" aria-hidden="true" />
            {history.map((entry, idx) => {
              const dot = STATUS_DOT[entry.status] || "bg-gray-400";
              const label = entry.status
                ? entry.status.charAt(0).toUpperCase() + entry.status.slice(1)
                : "Update";
              const dateLabel = formatDateTime(entry.changed_at || entry.created_at);
              return (
                <li key={idx} className="relative pl-7">
                  <span
                    className={`absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full ${dot} ring-4 ring-[var(--surface-4)]`}
                    aria-hidden="true"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-white text-[14px] font-medium">{label}</span>
                    {dateLabel && (
                      <span className="text-[11px] text-[var(--text-muted)]">{dateLabel}</span>
                    )}
                  </div>
                  {entry.note && (
                    <p className="mt-1 text-[13px] text-[var(--text-secondary)] whitespace-pre-line">
                      {entry.note}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </section>

      {/* Footer actions */}
      <section className="mt-5 mb-2 bg-[var(--surface-4)] border border-[var(--border-soft)] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <p className="text-white font-semibold">Need to make changes?</p>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            {canWithdraw
              ? "You can withdraw your application while it's still being reviewed."
              : "This application can no longer be withdrawn."}
          </p>
        </div>
        {canWithdraw && (
          <button
            type="button"
            onClick={handleWithdraw}
            disabled={withdrawing}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {withdrawing ? (
              <>
                <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                Withdrawing...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
                Withdraw Application
              </>
            )}
          </button>
        )}
      </section>
    </div>
  );
}
