import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCompanySearch } from "../contexts/CompanySearchContext";

const PALETTE_TONES = ["avatar-blue", "avatar-green", "avatar-gray", "avatar-cyan", "avatar-purple", "avatar-gold"];

function initials(name) {
  if (!name) return "C";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function pickTone(seed) {
  if (!seed) return PALETTE_TONES[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTE_TONES[hash % PALETTE_TONES.length];
}

function Avatar({ name, uid }) {
  const tone = pickTone(name || uid);
  return (
    <div
      className={`w-9 h-9 rounded-full ${tone} flex items-center justify-center text-white text-[13px] font-semibold flex-shrink-0`}
    >
      {initials(name)}
    </div>
  );
}

function CompanyRow({ company, active, onMouseEnter, onClick }) {
  return (
    <button
      type="button"
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      data-active={active}
      className="command-row w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left"
    >
      <Avatar name={company.company_name} uid={company.uid} />
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold text-white truncate">{company.company_name}</p>
        <p className="text-[12px] text-[var(--text-muted)] truncate">
          {company.industry || "Company"}
          {company.location ? ` · ${company.location}` : ""}
        </p>
      </div>
      {company.role && (
        <span className="hidden sm:inline-flex text-[11px] uppercase tracking-wider text-[var(--text-muted)] border border-[var(--border-medium)] rounded-full px-2 py-0.5">
          Hiring
        </span>
      )}
    </button>
  );
}

function RoleRow({ role, active, onMouseEnter, onClick }) {
  return (
    <button
      type="button"
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      data-active={active}
      className="command-row w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left"
    >
      <div className="w-9 h-9 rounded-xl bg-[var(--surface-4)] border border-[var(--border-medium)] flex items-center justify-center flex-shrink-0">
        <svg
          className="w-4 h-4 text-[var(--accent-blue)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 14.15v4.075a2.25 2.25 0 01-2.27 2.246 18.002 18.002 0 01-7.96-2.81m11.23-3.511a18.002 18.002 0 00-7.96-2.81m0 0V6.341c0-1.18.91-2.165 2.09-2.247h.09a2.25 2.25 0 012.25 2.25v.875M15.75 7.094v-1.5a2.25 2.25 0 00-2.25-2.25h-.094a2.25 2.25 0 00-2.25 2.25v1.5"
          />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold text-white truncate">{role.role}</p>
        <p className="text-[12px] text-[var(--text-muted)] truncate">
          {role.company_name}
          {role.location ? ` · ${role.location}` : ""}
        </p>
      </div>
      <span className="hidden sm:inline-flex text-[11px] uppercase tracking-wider text-[var(--text-muted)] border border-[var(--border-medium)] rounded-full px-2 py-0.5">
        Full-time
      </span>
    </button>
  );
}

export default function CommandPalette({ open, onClose }) {
  const { query, setQuery, results, feed, loading } = useCompanySearch();
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const isSearching = query.trim().length > 0;

  const flatItems = useMemo(() => {
    const companies = isSearching ? results : feed;
    const roles = [];
    companies.forEach((c) => {
      if (c.role) {
        roles.push({
          uid: `${c.uid}__role`,
          role: c.role,
          company_name: c.company_name,
          company_uid: c.uid,
          location: c.location,
        });
      }
    });
    return { companies, roles, all: [...companies, ...roles] };
  }, [isSearching, results, feed]);

  const visibleCompanies = flatItems.companies.slice(0, 6);
  const visibleRoles = flatItems.roles.slice(0, 6);
  const all = [...visibleCompanies, ...visibleRoles];

  useEffect(() => {
    if (open) {
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, Math.max(all.length - 1, 0)));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = all[activeIndex];
        if (item) {
          const uid = item.uid.includes("__role") ? item.company_uid : item.uid;
          navigate(`/student/company/${uid}`);
          onClose();
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, all, activeIndex, navigate, onClose]);

  useEffect(() => {
    if (!open) return undefined;
    const handleMeta = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", handleMeta);
    return () => document.removeEventListener("keydown", handleMeta);
  }, [open, onClose]);

  if (!open) return null;

  const selectCompany = (c) => {
    navigate(`/student/company/${c.uid}`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[8vh] sm:pt-[10vh]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div
        className="command-palette-modal relative w-full max-w-[600px] rounded-2xl border border-[var(--border-medium)] overflow-hidden"
        style={{
          background: "var(--surface-4)",
          boxShadow:
            "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border-soft)]">
          <svg
            className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search companies, roles, locations..."
            className="command-palette-input flex-1 bg-transparent border-0 outline-none text-[15px] text-white placeholder:text-[var(--text-placeholder)]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-[var(--text-muted)] hover:text-white transition-colors"
              aria-label="Clear"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <span className="kbd">Esc</span>
        </div>

        <div className="max-h-[60vh] overflow-y-auto py-2">
          {loading && (
            <div className="px-6 py-8 text-center text-[13px] text-[var(--text-muted)]">Searching...</div>
          )}

          {!loading && visibleCompanies.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-[15px] font-medium text-white">No results</p>
              <p className="mt-1 text-[13px] text-[var(--text-muted)]">
                Try a different company name, role, or location.
              </p>
            </div>
          )}

          {!loading && visibleCompanies.length > 0 && (
            <>
              <div className="px-5 pt-3 pb-1.5 text-[11px] uppercase tracking-[0.12em] font-medium text-[var(--text-muted)]">
                Companies
              </div>
              <div className="px-3 pb-2 space-y-0.5">
                {visibleCompanies.map((c, i) => (
                  <CompanyRow
                    key={c.uid}
                    company={c}
                    active={activeIndex === i}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => selectCompany(c)}
                  />
                ))}
              </div>
            </>
          )}

          {!loading && visibleRoles.length > 0 && (
            <>
              <div className="my-1 mx-5 border-t border-[var(--border-soft)]" />
              <div className="px-5 pt-2 pb-1.5 text-[11px] uppercase tracking-[0.12em] font-medium text-[var(--text-muted)]">
                Roles
              </div>
              <div className="px-3 pb-3 space-y-0.5">
                {visibleRoles.map((r, i) => (
                  <RoleRow
                    key={r.uid}
                    role={r}
                    active={activeIndex === visibleCompanies.length + i}
                    onMouseEnter={() => setActiveIndex(visibleCompanies.length + i)}
                    onClick={() => {
                      navigate(`/student/company/${r.company_uid}`);
                      onClose();
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 px-5 py-3 border-t border-[var(--border-soft)] bg-[var(--surface-3)]">
          <div className="flex items-center gap-3 text-[11px] text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5">
              <span className="kbd">↑</span>
              <span className="kbd">↓</span>
              Navigate
            </span>
            <span className="flex items-center gap-1.5">
              <span className="kbd">↵</span>
              Select
            </span>
          </div>
          <div className="text-[11px] text-[var(--text-muted)] hidden sm:block">
            Powered by <span className="gradient-text font-semibold">VerifAI</span>
          </div>
        </div>
      </div>
    </div>
  );
}