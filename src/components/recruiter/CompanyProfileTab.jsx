/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";
import {
  getMyCompany,
  upsertMyCompany,
  updateMyCompany,
  uploadPhoto,
  getPhotoUrl,
} from "../../api/auth";

const EMPTY_FORM = {
  company_name: "",
  role: "",
  location: "",
  description: "",
  website: "",
  industry: "",
  company_size: "",
  logo_url: "",
};

function Field({ label, required, hint, children }) {
  return (
    <div>
      <label className="block text-[12px] text-[var(--text-secondary)] mb-1.5 font-medium">
        {label}
        {required && <span className="text-yellow-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && (
        <p className="text-[11px] text-[var(--text-muted)] mt-1">{hint}</p>
      )}
    </div>
  );
}

const inputClass =
  "w-full bg-black/40 border border-gray-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 transition-colors";

export default function CompanyProfileTab({ showToast, refreshKey, onCompanySaved }) {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    getMyCompany()
      .then((res) => {
        if (cancelled) return;
        const data = res.data;
        if (data && data.uid) {
          setCompany(data);
          setForm({
            company_name: data.company_name || "",
            role: data.role || "",
            location: data.location || "",
            description: data.description || "",
            website: data.website || "",
            industry: data.industry || "",
            company_size: data.company_size || "",
            logo_url: data.logo_url || "",
          });
        } else {
          setNotFound(true);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        if (err?.response?.status === 404) {
          setNotFound(true);
        } else {
          showToast?.("error", err?.response?.data?.detail || "Failed to load company profile.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey, showToast]);

  const startEditing = () => {
    if (company) {
      setForm({
        company_name: company.company_name || "",
        role: company.role || "",
        location: company.location || "",
        description: company.description || "",
        website: company.website || "",
        industry: company.industry || "",
        company_size: company.company_size || "",
        logo_url: company.logo_url || "",
      });
    }
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    if (company) {
      setForm({
        company_name: company.company_name || "",
        role: company.role || "",
        location: company.location || "",
        description: company.description || "",
        website: company.website || "",
        industry: company.industry || "",
        company_size: company.company_size || "",
        logo_url: company.logo_url || "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
  };

  const handleSave = async () => {
    if (!form.company_name.trim() || !form.role.trim() || !form.location.trim()) {
      showToast?.("error", "Company name, role, and location are required.");
      return;
    }
    setSaving(true);
    try {
      let res;
      if (company?.uid) {
        res = await updateMyCompany(form);
      } else {
        res = await upsertMyCompany(form);
      }
      setCompany(res.data);
      setEditing(false);
      onCompanySaved?.();
      showToast?.("success", company?.uid ? "Company profile updated." : "Company profile created.");
    } catch (err) {
      const detail =
        err?.response?.data?.detail ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err?.message ||
        "Failed to save company profile.";
      showToast?.("error", detail);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const res = await uploadPhoto(file);
      const photoUrl = res.data?.photo_url;
      if (!photoUrl) throw new Error("No photo_url returned");
      const next = { ...form, logo_url: photoUrl };
      setForm(next);
      // Persist to backend if company exists
      if (company?.uid) {
        const saved = await updateMyCompany({ logo_url: photoUrl });
        setCompany(saved.data);
      }
      showToast?.("success", "Logo uploaded.");
    } catch (err) {
      showToast?.(
        "error",
        err?.response?.data?.detail || "Logo upload failed."
      );
    } finally {
      setUploadingLogo(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-4)] p-8 animate-pulse">
        <div className="h-6 w-48 bg-white/5 rounded mb-4" />
        <div className="h-4 w-72 bg-white/5 rounded mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 bg-white/5 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // Empty state — no company yet
  if (notFound && !company) {
    return (
      <div className="animate-fade-in">
        <div className="rounded-2xl border border-dashed border-[var(--border-soft)] bg-[var(--surface-4)] p-8 sm:p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
            </svg>
          </div>
          <h3 className="text-white font-semibold text-lg">No company profile yet</h3>
          <p className="text-[var(--text-secondary)] text-sm mt-2 max-w-md mx-auto">
            Create your company profile so students can discover you and learn about the roles you're hiring for.
          </p>
          <button
            type="button"
            onClick={startEditing}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create Company Profile
          </button>
        </div>

        {editing && renderForm()}
      </div>
    );
  }

  // Loaded — either viewing or editing existing company
  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">Company Profile</h2>
          <p className="text-[12px] text-[var(--text-secondary)] mt-1">
            This information is shown to students on your public company page.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {company?.uid && (
            <a
              href={`/recruiter/company/${company.uid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-300 hover:text-white border border-gray-700/50 hover:border-gray-600 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              View Public Profile
            </a>
          )}
          {!editing && (
            <button
              type="button"
              onClick={startEditing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
              </svg>
              Edit
            </button>
          )}
        </div>
      </div>

      {!editing ? renderView() : renderForm()}

      {/* Logo upload (always available) */}
      <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-4)] p-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-black/30 border border-[var(--border-soft)] flex items-center justify-center overflow-hidden flex-shrink-0">
              {form.logo_url ? (
                <img
                  src={getPhotoUrl(form.logo_url)}
                  alt="Company logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[var(--text-muted)] text-[11px] text-center px-2">
                  No logo
                </span>
              )}
            </div>
            <div>
              <p className="text-white text-sm font-medium">Company logo</p>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                PNG or JPG, square recommended.
              </p>
            </div>
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingLogo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-300 hover:text-white border border-gray-700/50 hover:border-gray-600 transition-colors disabled:opacity-50"
            >
              {uploadingLogo ? (
                <span className="w-3.5 h-3.5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              )}
              {uploadingLogo ? "Uploading..." : "Upload Logo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  function renderView() {
    if (!company) return null;
    return (
      <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-4)] p-6">
        <div className="flex items-start gap-4 mb-5">
          {company.logo_url ? (
            <img
              src={getPhotoUrl(company.logo_url)}
              alt={company.company_name}
              className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--accent-blue)] to-[#1d4ed8] flex items-center justify-center text-white font-semibold flex-shrink-0">
              {(company.company_name || "C").slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-white text-lg font-semibold truncate">{company.company_name}</h3>
            <p className="text-[13px] text-[var(--text-secondary)] truncate">
              {company.role}
              {company.location ? ` · ${company.location}` : ""}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <Info label="Industry" value={company.industry} />
          <Info label="Company size" value={company.company_size} />
          <Info label="Website" value={company.website} link />
          <Info label="Followers" value={company.follower_count} />
          <Info label="Open roles" value={company.open_roles_count} />
        </div>

        {company.description && (
          <div className="mt-5 pt-5 border-t border-[var(--border-soft)]">
            <p className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] mb-2">About</p>
            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
              {company.description}
            </p>
          </div>
        )}
      </div>
    );
  }

  function renderForm() {
    return (
      <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-4)] p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Company name" required>
            <input
              className={inputClass}
              placeholder="Acme Inc."
              value={form.company_name}
              onChange={(e) => setForm({ ...form, company_name: e.target.value })}
            />
          </Field>
          <Field label="Default hiring role" required hint="Free-text position you typically hire for">
            <input
              className={inputClass}
              placeholder="Software Engineer Intern"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />
          </Field>
          <Field label="Location" required>
            <input
              className={inputClass}
              placeholder="San Francisco, CA"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </Field>
          <Field label="Industry">
            <input
              className={inputClass}
              placeholder="AI / Fintech / Healthcare"
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
            />
          </Field>
          <Field label="Company size">
            <input
              className={inputClass}
              placeholder="1-10, 11-50, 51-200, 200+"
              value={form.company_size}
              onChange={(e) => setForm({ ...form, company_size: e.target.value })}
            />
          </Field>
          <Field label="Website">
            <input
              className={inputClass}
              placeholder="https://acme.com"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
            />
          </Field>
        </div>

        <Field label="Description">
          <textarea
            className={`${inputClass} min-h-[120px] resize-y`}
            placeholder="Tell students about your team, culture, and what you're building."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Field>

        <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-[var(--border-soft)]">
          {company?.uid && (
            <button
              type="button"
              onClick={cancelEditing}
              disabled={saving}
              className="px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-white border border-gray-700/50 hover:border-gray-600 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors disabled:opacity-50"
          >
            {saving && (
              <span className="w-3.5 h-3.5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            )}
            {saving ? "Saving..." : company?.uid ? "Save changes" : "Create profile"}
          </button>
        </div>
      </div>
    );
  }
}

function Info({ label, value, link }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] mb-1">{label}</p>
      {link ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-yellow-400 hover:text-yellow-300 text-sm break-all"
        >
          {value}
        </a>
      ) : (
        <p className="text-white text-sm">{value}</p>
      )}
    </div>
  );
}
