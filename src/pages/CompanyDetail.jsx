import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCompany, getCompanyLogoUrl } from "../api/auth";
import { useAuth } from "../hooks/useAuth";

function initialsOf(name) {
  if (!name) return "C";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function normalizeWebsite(url) {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function formatJoinedDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  const month = d.toLocaleDateString("en-US", { month: "long" });
  return `Member since ${month} ${d.getFullYear()}`;
}

function StatCard({ icon, label, value }) {
  return (
    <div className="flex-1 min-w-0 rounded-xl bg-[var(--surface-3)] border border-[var(--border-soft)] px-4 py-3">
      <div className="flex items-center gap-2 text-[var(--text-muted)]">
        {icon}
        <span className="text-[11px] uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-1.5 text-white text-lg font-semibold truncate">{value}</p>
    </div>
  );
}

function FactRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="w-8 h-8 rounded-lg bg-[var(--surface-3)] border border-[var(--border-soft)] flex items-center justify-center flex-shrink-0 text-[var(--accent-gold)]">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
          {label}
        </p>
        <div className="mt-0.5 text-sm text-white break-words">{value}</div>
      </div>
    </div>
  );
}

export default function CompanyDetail() {
  const { uid } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logoFailed, setLogoFailed] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setLogoFailed(false);
    getCompany(uid)
      .then((res) => {
        if (!cancelled) setCompany(res.data);
      })
      .catch((err) => {
        if (!cancelled)
          setError(err?.response?.data?.detail || "Company not found");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [uid]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 animate-fade-in">
        <div className="h-4 w-16 bg-white/5 rounded mb-6 animate-pulse-soft" />
        <div className="bg-[var(--surface-4)] border border-[var(--border-soft)] rounded-2xl p-6 sm:p-8 animate-pulse-soft">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-2xl bg-white/5 flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-6 w-2/3 bg-white/5 rounded" />
              <div className="h-4 w-1/3 bg-white/5 rounded" />
              <div className="h-4 w-1/2 bg-white/5 rounded" />
              <div className="flex gap-2 mt-3">
                <div className="h-6 w-20 bg-white/5 rounded-full" />
                <div className="h-6 w-28 bg-white/5 rounded-full" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-8">
            <div className="h-20 bg-white/5 rounded-xl" />
            <div className="h-20 bg-white/5 rounded-xl" />
            <div className="h-20 bg-white/5 rounded-xl" />
          </div>
        </div>
        <div className="h-48 bg-[var(--surface-4)] border border-[var(--border-soft)] rounded-2xl mt-6 animate-pulse-soft" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 animate-fade-in">
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Back
        </button>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-300">
          {error}
        </div>
      </div>
    );
  }

  if (!company) return null;

  const {
    company_name,
    role,
    location,
    description,
    website,
    industry,
    company_size,
    logo_url,
    follower_count,
    open_roles_count,
    created_at,
  } = company;

  const websiteUrl = normalizeWebsite(website);
  const joinedLabel = formatJoinedDate(created_at);
  const isStudent = !user || user.role === "student";
  const initials = initialsOf(company_name);

  const logoSrc =
    !logoFailed && logo_url
      ? logo_url
      : logo_url
        ? null
        : getCompanyLogoUrl(uid);

  const showLogoImage = !!logoSrc;

  const handleApply = () => {
    setNotice(
      "Applications are coming soon. We're putting the finishing touches on the flow!"
    );
    setTimeout(() => setNotice(null), 3500);
  };

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
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        Back
      </button>

      {/* Hero / Header Card */}
      <section className="bg-[var(--surface-4)] border border-[var(--border-soft)] rounded-2xl overflow-hidden">
        <div className="h-32 sm:h-40 bg-gradient-to-r from-amber-900/60 via-amber-800/40 to-amber-950/30" />

        <div className="px-6 sm:px-8 pb-6 sm:pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5 sm:gap-6 -mt-14 sm:-mt-16">
            {/* Logo */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-4 border-[var(--surface-4)] bg-[var(--surface-3)] flex items-center justify-center overflow-hidden flex-shrink-0">
              {showLogoImage ? (
                <img
                  src={logoSrc}
                  alt={company_name || "Company logo"}
                  className="w-full h-full object-cover"
                  onError={() => setLogoFailed(true)}
                />
              ) : (
                <div className="w-full h-full bg-[var(--accent-gold)] flex items-center justify-center text-black font-bold text-3xl sm:text-4xl">
                  {initials}
                </div>
              )}
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-white break-words">
                {company_name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {industry && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider text-[var(--text-secondary)] bg-white/5 border border-[var(--border-soft)]">
                    {industry}
                  </span>
                )}
                {role && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border border-[var(--accent-gold)]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)]" />
                    Hiring: {role}
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--text-secondary)]">
                {location && (
                  <span className="inline-flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4 text-[var(--text-muted)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                    {location}
                  </span>
                )}
                {websiteUrl && (
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[var(--accent-gold)] hover:underline"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A8.966 8.966 0 013 12c0-1.264.26-2.467.732-3.559"
                      />
                    </svg>
                    Website
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatCard
              label="Open roles"
              value={open_roles_count ?? 0}
              icon={
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 14.15v4.075a2.25 2.25 0 01-2.27 2.246 18.002 18.002 0 01-7.96-2.81m11.23-3.511a18.002 18.002 0 00-7.96-2.81m0 0V6.341c0-1.18.91-2.165 2.09-2.247h.09a2.25 2.25 0 012.25 2.25v.875M15.75 7.094v-1.5a2.25 2.25 0 00-2.25-2.25h-.094a2.25 2.25 0 00-2.25 2.25v1.5"
                  />
                </svg>
              }
            />
            <StatCard
              label="Followers"
              value={follower_count ?? 0}
              icon={
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                  />
                </svg>
              }
            />
            <StatCard
              label="Company size"
              value={company_size || "Not specified"}
              icon={
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                  />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* About / Description */}
      <section className="mt-6 bg-[var(--surface-4)] border border-[var(--border-soft)] rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full bg-[var(--accent-gold)]" />
          <h2 className="text-lg font-semibold text-white">About</h2>
        </div>
        {description ? (
          <div className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line text-[15px]">
            {description}
          </div>
        ) : (
          <p className="text-[var(--text-muted)] italic text-sm">
            No description yet.
          </p>
        )}
      </section>

      {/* Quick Facts */}
      <section className="mt-6 bg-[var(--surface-4)] border border-[var(--border-soft)] rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-5 rounded-full bg-[var(--accent-gold)]" />
          <h2 className="text-lg font-semibold text-white">Quick facts</h2>
        </div>

        <div className="divide-y divide-[var(--border-soft)]">
          <FactRow
            label="Industry"
            value={industry || <span className="text-[var(--text-muted)] italic">Not specified</span>}
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.75M9 12.75h6.75M9 18.75h6.75"
                />
              </svg>
            }
          />
          <FactRow
            label="Company size"
            value={company_size || <span className="text-[var(--text-muted)] italic">Not specified</span>}
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                />
              </svg>
            }
          />
          <FactRow
            label="Headquarters"
            value={location || <span className="text-[var(--text-muted)] italic">Not specified</span>}
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
            }
          />
          <FactRow
            label="Website"
            value={
              websiteUrl ? (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent-gold)] hover:underline break-all"
                >
                  {website}
                </a>
              ) : (
                <span className="text-[var(--text-muted)] italic">Not specified</span>
              )
            }
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582"
                />
              </svg>
            }
          />
          <FactRow
            label="Date joined"
            value={
              joinedLabel || (
                <span className="text-[var(--text-muted)] italic">Not available</span>
              )
            }
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
            }
          />
        </div>
      </section>

      {/* Footer Action Area */}
      <section className="mt-6 mb-4 bg-[var(--surface-4)] border border-[var(--border-soft)] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <p className="text-white font-semibold">
            Interested in joining {company_name}?
          </p>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            {role
              ? `They're currently hiring for ${role}.`
              : "Check out their open roles."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => navigate(`/student/company/${uid}/jobs`)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-white/5 text-white border border-[var(--border-soft)] hover:bg-white/10 hover:border-[var(--accent-gold)]/30 transition-all whitespace-nowrap"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 14.15v4.075a2.25 2.25 0 01-2.27 2.246 18.002 18.002 0 01-7.96-2.81m11.23-3.511a18.002 18.002 0 00-7.96-2.81m0 0V6.341c0-1.18.91-2.165 2.09-2.247h.09a2.25 2.25 0 012.25 2.25v.875m7.5-3.375h-3.75m0 0h-.008v.008h.008V9z"
              />
            </svg>
            View Jobs
          </button>

          {isStudent ? (
            <button
              type="button"
              onClick={handleApply}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-[var(--accent-gold)] text-black hover:brightness-95 active:brightness-90 transition-all shadow-sm shadow-[var(--accent-gold)]/20 whitespace-nowrap"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                />
              </svg>
              Apply Now
            </button>
          ) : (
            <span className="inline-flex items-center px-4 py-2 rounded-xl text-xs text-[var(--text-muted)] bg-white/5 border border-[var(--border-soft)] whitespace-nowrap">
              Recruiters can't apply
            </span>
          )}
        </div>
      </section>

      {/* Inline notice (Apply placeholder) */}
      {notice && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="px-4 py-3 rounded-xl bg-[var(--surface-5)] border border-[var(--accent-gold)]/30 text-sm text-white shadow-lg shadow-black/40 max-w-md">
            <div className="flex items-start gap-2">
              <svg
                className="w-4 h-4 text-[var(--accent-gold)] mt-0.5 flex-shrink-0"
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
              <span>{notice}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
