import StatCard from "./StatCard";
import { timeAgo } from "./helpers";

const ICON = (props) => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} {...props} />
);

function progressForCompany(company) {
  if (!company) return { pct: 0, missing: ["company_name", "role", "location"] };
  const fields = ["company_name", "role", "location", "description", "website", "industry", "company_size", "logo_url"];
  const filled = fields.filter((f) => {
    const v = company[f];
    return v !== null && v !== undefined && v !== "";
  });
  const missing = fields.filter((f) => {
    const v = company[f];
    return v === null || v === undefined || v === "";
  });
  return {
    pct: Math.round((filled.length / fields.length) * 100),
    missing,
  };
}

export default function OverviewTab({
  displayName,
  email,
  profile,
  company,
  statusCounts,
  totalApplications,
  recentApplications,
  loading,
  onNavigate,
}) {
  const greetingName =
    profile?.display_name ||
    displayName ||
    (email ? email.split("@")[0] : "there");
  const progress = progressForCompany(company);
  const firstName = greetingName.split(/\s+/)[0] || greetingName;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight">
          Welcome back, <span className="gradient-text">{firstName}</span>
        </h2>
        <p className="text-[13px] text-[var(--text-secondary)] mt-1.5">
          Here's how your hiring pipeline looks today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Total Applications"
          value={totalApplications}
          loading={loading}
          tone="gold"
          icon={
            <ICON>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </ICON>
          }
        />
        <StatCard
          label="Submitted"
          value={statusCounts.submitted}
          loading={loading}
          tone="blue"
          icon={
            <ICON>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 18H6.75A2.25 2.25 0 014.5 19.5V6.75a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0116.5 6.75v3.75m-3 3.75h-3m3 0h3m-3 0v3m3-3v3m3-3h3m-3 3h3m-3-3v3" />
            </ICON>
          }
        />
        <StatCard
          label="Reviewing"
          value={statusCounts.reviewing}
          loading={loading}
          tone="amber"
          icon={
            <ICON>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </ICON>
          }
        />
        <StatCard
          label="Accepted"
          value={statusCounts.accepted}
          loading={loading}
          tone="green"
          icon={
            <ICON>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </ICON>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Company profile completion */}
        <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-4)] p-5 lg:col-span-1">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-medium">
                Company Profile
              </p>
              <h3 className="text-white font-semibold text-[15px] mt-1">
                Profile {progress.pct}% complete
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate?.("company")}
              className="text-[12px] text-yellow-400 hover:text-yellow-300 transition-colors flex-shrink-0"
            >
              {company ? "Edit" : "Set up"} →
            </button>
          </div>

          <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full transition-all duration-500"
              style={{ width: `${progress.pct}%` }}
            />
          </div>

          <p className="text-[12px] text-[var(--text-secondary)] mt-3">
            {progress.pct >= 100
              ? "Your profile is fully set up. Nice work."
              : progress.missing.length > 0
                ? `Add ${progress.missing.length} more field${progress.missing.length === 1 ? "" : "s"} to complete your profile.`
                : "Almost there."}
          </p>

          {progress.missing.length > 0 && progress.missing.length <= 3 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {progress.missing.map((f) => (
                <span
                  key={f}
                  className="bg-white/5 text-gray-400 border border-gray-700/50 rounded-lg px-2.5 py-1 text-[11px]"
                >
                  {f.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Open roles summary */}
        <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-4)] p-5 lg:col-span-1">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-medium">
                Open Roles
              </p>
              <h3 className="text-white font-semibold text-[15px] mt-1">
                {company
                  ? `${company.open_roles_count ?? 0} live`
                  : "Not set up yet"}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate?.("jobs")}
              className="text-[12px] text-yellow-400 hover:text-yellow-300 transition-colors flex-shrink-0"
            >
              {company ? "Manage roles →" : "Set up →"}
            </button>
          </div>

          {company ? (
            <>
              <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (company.open_roles_count ?? 0) * 25)}%`,
                  }}
                />
              </div>
              <p className="text-[12px] text-[var(--text-secondary)] mt-3">
                {(company.open_roles_count ?? 0) === 0
                  ? "Create your first role to start receiving applications."
                  : `Students can apply to ${company.open_roles_count} role${company.open_roles_count === 1 ? "" : "s"} right now.`}
              </p>
            </>
          ) : (
            <p className="text-[12px] text-[var(--text-secondary)] mt-1">
              Once your company profile is set up, you'll be able to post roles here.
            </p>
          )}
        </div>

        {/* Recent applications */}
        <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-4)] p-5 lg:col-span-1">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-medium">
                Recent Activity
              </p>
              <h3 className="text-white font-semibold text-[15px] mt-1">
                Latest applications
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate?.("applications")}
              className="text-[12px] text-yellow-400 hover:text-yellow-300 transition-colors flex-shrink-0"
            >
              View all →
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 rounded-lg bg-white/5 animate-pulse"
                />
              ))}
            </div>
          ) : recentApplications.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-[var(--text-muted)] text-sm">
                No applications yet. Once students apply, they'll show up here.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentApplications.slice(0, 4).map((app) => (
                <div
                  key={app.id || app.uid}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.03] transition-colors"
                >
                  <div className="w-9 h-9 rounded-full avatar-blue flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                    {(app.student_display_name || "?").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {app.student_display_name || "Applicant"}
                    </p>
                    <p className="text-[var(--text-muted)] text-[11px]">
                      Applied {timeAgo(app.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
