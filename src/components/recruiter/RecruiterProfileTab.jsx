/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";
import { useProfile } from "../../contexts/ProfileContext";
import { getPhotoUrl, uploadPhoto } from "../../api/auth";

const inputClass =
  "w-full bg-black/40 border border-gray-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 transition-colors";

function initialsFromName(name, fallback = "U") {
  if (!name) return fallback;
  const parts = String(name).trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function RecruiterProfileTab({ user, showToast }) {
  const { profile, updateProfile } = useProfile();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    display_name: "",
    company_email: "",
    role_title: "",
    location: "",
  });

  useEffect(() => {
    if (!profile) return;
    setForm({
      display_name: profile.display_name || "",
      company_email: profile.company_email || "",
      role_title: profile.role_title || "",
      location: profile.location || "",
    });
  }, [profile]);

  const startEditing = () => {
    setForm({
      display_name: profile?.display_name || "",
      company_email: profile?.company_email || "",
      role_title: profile?.role_title || "",
      location: profile?.location || "",
    });
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        display_name: form.display_name?.trim() || null,
        company_email: form.company_email?.trim() || null,
        role_title: form.role_title?.trim() || null,
        location: form.location?.trim() || null,
      });
      setEditing(false);
      showToast?.("success", "Profile updated.");
    } catch (err) {
      const detail =
        err?.response?.data?.detail ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err?.message ||
        "Failed to update profile.";
      showToast?.("error", detail);
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadPhoto(file);
      await updateProfile({ photo_url: res.data.photo_url });
      showToast?.("success", "Photo updated.");
    } catch (err) {
      const detail =
        err?.response?.data?.detail || "Failed to upload photo.";
      showToast?.("error", detail);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const photoUrl = getPhotoUrl(profile.photo_url);
  const displayName = profile.display_name || user?.displayName || user?.email?.split("@")[0] || "Recruiter";
  const initials = initialsFromName(displayName, user?.email?.[0]?.toUpperCase() || "R");

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">My Profile</h2>
          <p className="text-[12px] text-[var(--text-secondary)] mt-1">
            Personal information tied to your recruiter account.
          </p>
        </div>
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

      <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-4)] p-6">
        <div className="flex items-center gap-5 mb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 group border border-[var(--border-soft)]"
          >
            {photoUrl ? (
              <img src={photoUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-yellow-400 flex items-center justify-center text-black font-semibold text-2xl">
                {initials}
              </div>
            )}
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {uploading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                </svg>
              )}
            </div>
          </button>
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-semibold text-lg truncate">{displayName}</h3>
            <p className="text-[12px] text-[var(--text-secondary)] truncate">{profile.email || user?.email}</p>
            <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-yellow-500/15 text-yellow-300 border border-yellow-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
              Recruiter
            </span>
          </div>
        </div>

        <div className="border-t border-[var(--border-soft)] pt-6">
          {editing ? (
            <div className="space-y-4">
              <FieldRow label="Display name">
                <input
                  className={inputClass}
                  placeholder="Your name"
                  value={form.display_name}
                  onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                />
              </FieldRow>
              <FieldRow label="Role title">
                <input
                  className={inputClass}
                  placeholder="e.g. Talent Lead"
                  value={form.role_title}
                  onChange={(e) => setForm({ ...form, role_title: e.target.value })}
                />
              </FieldRow>
              <FieldRow label="Company email">
                <input
                  className={inputClass}
                  placeholder="you@company.com"
                  type="email"
                  value={form.company_email}
                  onChange={(e) => setForm({ ...form, company_email: e.target.value })}
                />
              </FieldRow>
              <FieldRow label="Location">
                <input
                  className={inputClass}
                  placeholder="City, Country"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </FieldRow>

              <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-[var(--border-soft)]">
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-white border border-gray-700/50 hover:border-gray-600 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors disabled:opacity-50"
                >
                  {saving && (
                    <span className="w-3.5 h-3.5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                  )}
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
              <Info label="Display name" value={profile.display_name} />
              <Info label="Role title" value={profile.role_title} />
              <Info label="Company email" value={profile.company_email} />
              <Info label="Location" value={profile.location} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FieldRow({ label, children }) {
  return (
    <div>
      <label className="block text-[12px] text-[var(--text-secondary)] mb-1.5 font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] mb-1">{label}</p>
      {value ? (
        <p className="text-white">{value}</p>
      ) : (
        <p className="text-gray-500 italic text-sm">Not set</p>
      )}
    </div>
  );
}
