import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCompany,
  getCompanyLogoUrl,
  listCompanyJobs,
} from "../api/auth";

function initials(name) {
  if (!name) return "C";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

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

function PinIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 text-[var(--text-muted)] flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
      />
    </svg>
  );
}

function Chip({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/5 text-[var(--text-secondary)] border border-[var(--border-soft)] capitalize ${className}`}
    >
      {children}
    </span>
  );
}

function SkillChip({ children }) {
  return (
    <span className="px-2.5 py-1 rounded-lg bg-[var(--surface-3)] text-gray-300 text-[11px] border border-[var(--border-soft)]">
      {children}
    </span>
  );
}

function JobCard({ job, companyUid }) {
  const navigate = useNavigate();
  const description = job.description || "";
  const excerpt =
    description.length > 150 ? `${description.slice(0, 150).trim()}...` : description;

  const skills = Array.isArray(job.required_skills) ? job.required_skills : [];
  const visibleSkills = skills.slice(0, 4);
  const remainingSkills = skills.length - visibleSkills.length;

  const salary = formatSalary(job.salary_min, job.salary_max, job.currency);

  const meta = [job.employment_type, job.work_mode, job.experience_level].filter(Boolean);

  return (
    <div className="bg-[var(--surface-4)] border border-[var(--border-soft)] rounded-2xl p-5 sm:p-6 flex flex-col gap-4 card-hover hover:border-[var(--border-medium)]">
      <div className="min-w-0">
        <h3 className="text-white font-semibold text-[17px] leading-snug break-words">
          {job.title}
        </h3>
        {job.department && (
          <p className="mt-1 text-[12px] text-[var(--text-muted)] uppercase tracking-wider">
            {job.department}
          </p>
        )}
      </div>

      {job.location && (
        <div className="flex items-center gap-1.5 text-[13px] text-[var(--text-secondary)]">
          <PinIcon />
          <span className="truncate">{job.location}</span>
        </div>
      )}

      {meta.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {meta.map((m, i) => (
            <Chip key={`${job.uid}-${i}`}>{m.replace(/_/g, " ")}</Chip>
          ))}
        </div>
      )}

      {salary && (
        <p className="text-[14px] font-medium text-[var(--accent-gold)]">{salary}</p>
      )}

      {excerpt && (
        <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed line-clamp-3">
          {excerpt}
        </p>
      )}

      {visibleSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {visibleSkills.map((skill, i) => (
            <SkillChip key={`${job.uid}-skill-${i}`}>{skill}</SkillChip>
          ))}
          {remainingSkills > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-[var(--surface-3)] text-[var(--text-muted)] text-[11px] border border-[var(--border-soft)]">
              +{remainingSkills} more
            </span>
          )}
        </div>
      )}

      <div className="mt-auto pt-2">
        <button
          type="button"
          onClick={() => navigate(`/student/apply/${companyUid}?job=${job.uid}`)}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-[var(--accent-gold)] text-black hover:brightness-95 active:brightness-90 transition-all shadow-sm shadow-[var(--accent-gold)]/20"
        >
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
              d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
            />
          </svg>
          Apply Now
        </button>
      </div>
    </div>
  );
}

export default function CompanyJobs() {
  const { uid: companyUid } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setLogoFailed(false);

    Promise.all([getCompany(companyUid), listCompanyJobs(companyUid, { status: "open" })])
      .then(([companyRes, jobsRes]) => {
        if (cancelled) return;
        setCompany(companyRes.data || null);
        const items = jobsRes.data?.items || jobsRes.data?.jobs || jobsRes.data || [];
        setJobs(Array.isArray(items) ? items : []);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.response?.data?.detail || "Failed to load jobs.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [companyUid]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4 sm:px-6 animate-fade-in">
        <div className="h-4 w-16 bg-white/5 rounded mb-6 animate-pulse" />
        <div className="bg-[var(--surface-4)] border border-[var(--border-soft)] rounded-2xl p-6 sm:p-8 animate-pulse">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-2xl bg-white/5 flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-6 w-1/2 bg-white/5 rounded" />
              <div className="h-4 w-1/3 bg-white/5 rounded" />
              <div className="h-4 w-1/4 bg-white/5 rounded" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-[var(--surface-4)] border border-[var(--border-soft)] animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4 sm:px-6 animate-fade-in">
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
          Back
        </button>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-300">
          {error}
        </div>
      </div>
    );
  }

  const companyName = company?.company_name || "Company";
  const companyInitial = initials(companyName);
  const logoUrl = company?.logo_url && !logoFailed ? company.logo_url : null;
  const fallbackLogo = logoUrl ? null : getCompanyLogoUrl(companyUid);
  const openCount = jobs.length;

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4 sm:px-6 animate-fade-in">
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
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back
      </button>

      {/* Header */}
      <section className="bg-[var(--surface-4)] border border-[var(--border-soft)] rounded-2xl overflow-hidden">
        <div className="h-28 sm:h-36 bg-gradient-to-r from-amber-900/60 via-amber-800/40 to-amber-950/30" />
        <div className="px-6 sm:px-8 pb-6 sm:pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5 sm:gap-6 -mt-12 sm:-mt-14">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-[var(--surface-4)] bg-[var(--surface-3)] flex items-center justify-center overflow-hidden flex-shrink-0">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={companyName}
                  className="w-full h-full object-cover"
                  onError={() => setLogoFailed(true)}
                />
              ) : fallbackLogo ? (
                <img
                  src={fallbackLogo}
                  alt={companyName}
                  className="w-full h-full object-cover"
                  onError={() => setLogoFailed(true)}
                />
              ) : (
                <div className="w-full h-full bg-[var(--accent-gold)] flex items-center justify-center text-black font-bold text-3xl">
                  {companyInitial}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 pb-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white break-words">
                {companyName}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border border-[var(--accent-gold)]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)]" />
                  {openCount} open role{openCount === 1 ? "" : "s"}
                </span>
                {company?.industry && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider text-[var(--text-secondary)] bg-white/5 border border-[var(--border-soft)]">
                    {company.industry}
                  </span>
                )}
                {company?.location && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] text-[var(--text-secondary)] bg-white/5 border border-[var(--border-soft)]">
                    <PinIcon />
                    {company.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs grid */}
      <section className="mt-6 sm:mt-8">
        {jobs.length === 0 ? (
          <div className="bg-[var(--surface-4)] border border-[var(--border-soft)] border-dashed rounded-2xl py-16 px-6 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[var(--surface-3)] flex items-center justify-center mb-4 border border-[var(--border-soft)]">
              <svg
                className="w-6 h-6 text-[var(--text-muted)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 14.15v4.075a2.25 2.25 0 01-2.27 2.246 18.002 18.002 0 01-7.96-2.81m11.23-3.511a18.002 18.002 0 00-7.96-2.81m0 0V6.341c0-1.18.91-2.165 2.09-2.247h.09a2.25 2.25 0 012.25 2.25v.875M15.75 7.094v-1.5a2.25 2.25 0 00-2.25-2.25h-.094a2.25 2.25 0 00-2.25 2.25v1.5"
                />
              </svg>
            </div>
            <p className="text-white font-medium text-[15px]">
              No open roles at {companyName} yet.
            </p>
            <p className="text-[13px] text-[var(--text-muted)] mt-1.5 max-w-sm">
              Check back soon — new opportunities are added regularly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {jobs.map((job) => (
              <JobCard key={job.uid} job={job} companyUid={companyUid} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
