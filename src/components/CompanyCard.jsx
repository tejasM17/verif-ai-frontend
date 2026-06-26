import { getCompanyLogoUrl } from "../api/auth";

function initialsOf(name) {
  if (!name) return "C";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function Logo({ name, uid }) {
  const url = uid ? getCompanyLogoUrl(uid) : null;
  if (url) {
    return (
      <img
        src={url}
        alt={name || "Company"}
        className="w-12 h-12 rounded-xl object-cover bg-[#222] flex-shrink-0"
        onError={(e) => {
          e.currentTarget.style.display = "none";
          e.currentTarget.nextSibling?.classList.remove("hidden");
        }}
      />
    );
  }
  return (
    <div className="w-12 h-12 rounded-xl bg-yellow-400 flex items-center justify-center text-black font-semibold flex-shrink-0">
      {initialsOf(name)}
    </div>
  );
}

export default function CompanyCard({ company, onClick }) {
  const { uid, company_name, role, location, industry } = company || {};
  return (
    <button
      type="button"
      onClick={() => onClick?.(company)}
      className="card-hover group flex items-start gap-4 w-full text-left bg-[#1f1f1f] hover:bg-[#252525] border border-gray-800/60 rounded-2xl p-4 sm:p-5 transition-all duration-300"
    >
      <Logo name={company_name} uid={uid} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-white font-semibold text-base sm:text-lg truncate">
            {company_name || "Unnamed Company"}
          </h3>
        </div>
        {role && (
          <p className="mt-1 text-sm text-gray-300 truncate flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0"
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
            <span className="truncate">{role}</span>
          </p>
        )}
        {location && (
          <p className="mt-1 text-xs text-gray-400 truncate flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5 flex-shrink-0"
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
            <span className="truncate">{location}</span>
          </p>
        )}
        {industry && (
          <span className="mt-2 inline-block text-[10px] uppercase tracking-wider text-gray-500 border border-gray-700/60 rounded-full px-2 py-0.5">
            {industry}
          </span>
        )}
      </div>
      <svg
        className="w-4 h-4 text-gray-500 group-hover:text-yellow-400 transition-colors flex-shrink-0 mt-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </button>
  );
}