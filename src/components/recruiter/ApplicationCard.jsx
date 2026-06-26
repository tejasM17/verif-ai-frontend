import { useState } from "react";
import { getPhotoUrl } from "../../api/auth";
import { initialsFromName, timeAgo, STATUS_META, STATUS_OPTIONS } from "./helpers";

export default function ApplicationCard({ application, onStatusChange, updating }) {
  const [expanded, setExpanded] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

  const status = application.status || "submitted";
  const meta = STATUS_META[status] || STATUS_META.submitted;
  const photoUrl = getPhotoUrl(application.student_photo_url);
  const name = application.student_display_name || "Applicant";
  const initials = initialsFromName(name, "?");
  const skills = Array.isArray(application.student_skills) ? application.student_skills : [];
  const why = application.why_appoint || "";
  const WHY_LIMIT = 180;
  const isLong = why.length > WHY_LIMIT;
  const visibleWhy = expanded || !isLong ? why : `${why.slice(0, WHY_LIMIT)}…`;
  const resumeUrl = application.resume_url
    ? getPhotoUrl(application.resume_url)
    : null;

  const isUpdating = updating || pendingStatus !== null;

  const handleStatusSelect = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === status) return;
    setPendingStatus(newStatus);
    try {
      await onStatusChange?.(application.id || application.uid, newStatus);
    } finally {
      setPendingStatus(null);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-4)] p-5 hover:border-[var(--border-medium)] transition-colors">
      <div className="flex items-start gap-4">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={name}
            className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-[var(--border-soft)]"
          />
        ) : (
          <div className="w-12 h-12 rounded-full avatar-blue flex items-center justify-center text-white font-semibold flex-shrink-0">
            {initials}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-white font-semibold text-[15px] truncate">{name}</h3>
              {application.student_email && (
                <p className="text-[12px] text-[var(--text-secondary)] truncate">
                  {application.student_email}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full border ${meta.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                {meta.label}
              </span>
            </div>
          </div>

          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {skills.slice(0, 8).map((skill, i) => (
                <span
                  key={`${skill}-${i}`}
                  className="bg-white/5 text-gray-300 border border-gray-700/50 rounded-lg px-2.5 py-1 text-xs"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 8 && (
                <span className="bg-white/5 text-gray-400 border border-gray-700/50 rounded-lg px-2.5 py-1 text-xs">
                  +{skills.length - 8}
                </span>
              )}
            </div>
          )}

          {why && (
            <div className="mt-3">
              <p className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Why they're a fit
              </p>
              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                {visibleWhy}
              </p>
              {isLong && (
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  className="text-[12px] text-yellow-400 hover:text-yellow-300 mt-1.5 transition-colors"
                >
                  {expanded ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[var(--border-soft)]">
            <div className="flex items-center gap-1.5 text-[12px] text-[var(--text-muted)]">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Applied {timeAgo(application.created_at)}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[12px] text-gray-300 hover:text-white border border-gray-700/50 hover:border-gray-600 rounded-lg px-2.5 py-1.5 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  View Resume
                </a>
              )}
              <div className="relative">
                <select
                  value={pendingStatus || status}
                  onChange={handleStatusSelect}
                  disabled={isUpdating}
                  className="appearance-none text-[12px] bg-yellow-500/15 text-yellow-300 hover:bg-yellow-500/25 border border-yellow-500/30 rounded-lg pl-3 pr-7 py-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-500/30 transition-colors disabled:opacity-50"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#1a1a1a] text-white">
                      {STATUS_META[opt].label}
                    </option>
                  ))}
                </select>
                <svg
                  className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-yellow-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
                {pendingStatus && (
                  <span className="absolute -top-1 -right-1 w-3 h-3">
                    <span className="absolute inset-0 rounded-full bg-yellow-400 animate-ping opacity-60" />
                    <span className="absolute inset-0 rounded-full bg-yellow-400" />
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
