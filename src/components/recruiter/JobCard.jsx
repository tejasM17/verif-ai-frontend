import { timeAgo } from "./helpers";

const STATUS_META = {
  open: { label: "Open", badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", dot: "bg-emerald-400" },
  closed: { label: "Closed", badge: "bg-gray-500/15 text-gray-300 border-gray-500/30", dot: "bg-gray-400" },
};

function formatSalary(min, max, currency) {
  const fmt = (v) => {
    if (v == null) return null;
    if (v >= 1000) return `$${Math.round(v / 1000)}k`;
    return `$${v}`;
  };
  const a = fmt(min);
  const b = fmt(max);
  if (a && b) return `${a} - ${b} ${currency || "USD"}`;
  if (a) return `${a}+ ${currency || "USD"}`;
  if (b) return `Up to ${b} ${currency || "USD"}`;
  return null;
}

export default function JobCard({ job, onEdit, onDelete, deleting }) {
  const status = (job.status || "open").toLowerCase();
  const meta = STATUS_META[status] || STATUS_META.open;

  const meta_parts = [job.employment_type, job.work_mode, job.experience_level].filter(Boolean);
  const skills = Array.isArray(job.required_skills) ? job.required_skills : [];
  const visibleSkills = skills.slice(0, 4);
  const remainingSkills = skills.length - visibleSkills.length;
  const salary = formatSalary(job.salary_min, job.salary_max, job.currency);

  return (
    <div
      className={`rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-4)] p-5 transition-colors ${
        deleting ? "opacity-60" : "hover:border-[var(--border-medium)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-white font-semibold text-[16px] truncate">{job.title}</h3>
            <span
              className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full border ${meta.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
              {meta.label}
            </span>
          </div>
          {job.department && (
            <p className="mt-1 text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
              {job.department}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => onEdit?.(job)}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] text-gray-300 hover:text-white border border-gray-700/50 hover:border-gray-600 transition-colors disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
            </svg>
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(job)}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/30 transition-colors disabled:opacity-50"
          >
            {deleting ? (
              <>
                <span className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                Delete
              </>
            )}
          </button>
        </div>
      </div>

      {job.location && (
        <div className="mt-3 flex items-center gap-1.5 text-[12px] text-[var(--text-secondary)]">
          <svg className="w-3.5 h-3.5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          <span className="truncate">{job.location}</span>
        </div>
      )}

      {meta_parts.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {meta_parts.map((m, i) => (
            <span
              key={`${job.uid}-${i}`}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/5 text-[var(--text-secondary)] border border-[var(--border-soft)] capitalize"
            >
              {m.replace(/_/g, " ")}
            </span>
          ))}
        </div>
      )}

      {salary && (
        <p className="mt-3 text-[13px] font-medium text-[var(--accent-gold)]">{salary}</p>
      )}

      {visibleSkills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {visibleSkills.map((skill, i) => (
            <span
              key={`${job.uid}-skill-${i}`}
              className="px-2 py-0.5 rounded-md bg-[var(--surface-3)] text-gray-300 text-[11px] border border-[var(--border-soft)]"
            >
              {skill}
            </span>
          ))}
          {remainingSkills > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-[var(--surface-3)] text-[var(--text-muted)] text-[11px] border border-[var(--border-soft)]">
              +{remainingSkills} more
            </span>
          )}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-[var(--border-soft)] flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Updated {timeAgo(job.updated_at || job.created_at)}
        </div>
        {job.applications_count != null && (
          <span className="text-[11px] text-[var(--text-muted)]">
            {job.applications_count} application{job.applications_count === 1 ? "" : "s"}
          </span>
        )}
      </div>
    </div>
  );
}