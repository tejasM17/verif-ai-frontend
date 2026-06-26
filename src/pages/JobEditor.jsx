import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getJob, createMyJob, updateJob } from "../api/auth";

function SkillInput({ skills, onChange }) {
  const [input, setInput] = useState("");
  const add = () => {
    const t = input.trim();
    if (!t || skills.includes(t)) return;
    onChange([...skills, t]);
    setInput("");
  };
  const remove = (i) => onChange(skills.filter((_, idx) => idx !== i));
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {skills.map((s, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 text-gray-300 text-xs border border-gray-700/50"
          >
            {s}
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-gray-500 hover:text-red-400 ml-0.5"
            >
              &times;
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="Type a skill and press Enter"
          className="flex-1 bg-black/40 border border-gray-700/50 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50"
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-400 text-sm hover:bg-yellow-500/30 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <section className="bg-[var(--surface-4)] border border-[var(--border-soft)] rounded-2xl p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-white text-sm font-semibold flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-[var(--accent-gold)]" />
          {title}
        </h2>
        {subtitle && (
          <p className="text-[var(--text-muted)] text-xs mt-1 ml-3">{subtitle}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, hint, children, required }) {
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </span>
        {hint && <span className="text-[10px] text-[var(--text-muted)]">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

const inputCls =
  "w-full bg-black/40 border border-gray-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 transition-colors";

const EMPLOYMENT_TYPES = [
  { value: "", label: "Select employment type" },
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "intern", label: "Intern" },
];

const WORK_MODES = [
  { value: "", label: "Select work mode" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "on-site", label: "On-site" },
];

const EXPERIENCE_LEVELS = [
  { value: "", label: "Select experience level" },
  { value: "entry", label: "Entry level" },
  { value: "mid", label: "Mid level" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead / Principal" },
];

const STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
];

const EMPTY_FORM = {
  title: "",
  department: "",
  location: "",
  employment_type: "",
  work_mode: "",
  experience_level: "",
  description: "",
  required_skills: [],
  salary_min: "",
  salary_max: "",
  currency: "USD",
  status: "open",
};

export default function JobEditor() {
  const { uid } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = Boolean(uid);

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Load existing job when in edit mode
  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    getJob(uid)
      .then((res) => {
        if (cancelled) return;
        const data = res?.data || {};
        setForm({
          title: data.title || "",
          department: data.department || "",
          location: data.location || "",
          employment_type: data.employment_type || "",
          work_mode: data.work_mode || "",
          experience_level: data.experience_level || "",
          description: data.description || "",
          required_skills: Array.isArray(data.required_skills) ? data.required_skills : [],
          salary_min: data.salary_min ?? "",
          salary_max: data.salary_max ?? "",
          currency: data.currency || "USD",
          status: data.status || "open",
        });
      })
      .catch((err) => {
        if (cancelled) return;
        const status = err?.response?.status;
        setLoadError(
          status === 404
            ? "Job not found"
            : err?.response?.data?.detail || "Failed to load job."
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isEdit, uid]);

  const updateField = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setSubmitError(null);

    if (!form.title.trim()) {
      setSubmitError("Title is required.");
      return;
    }

    setSubmitting(true);
    try {
      // Build payload — only send fields that have values to avoid overwriting with empty strings
      const payload = {
        title: form.title.trim(),
        department: form.department.trim() || null,
        location: form.location.trim() || null,
        employment_type: form.employment_type || null,
        work_mode: form.work_mode || null,
        experience_level: form.experience_level || null,
        description: form.description.trim() || null,
        required_skills: form.required_skills,
        salary_min: form.salary_min === "" || !Number.isFinite(Number(form.salary_min)) ? null : Number(form.salary_min),
        salary_max: form.salary_max === "" || !Number.isFinite(Number(form.salary_max)) ? null : Number(form.salary_max),
        currency: form.currency.trim() || "USD",
      };

      if (isEdit) {
        if (form.status) payload.status = form.status;
        await updateJob(uid, payload);
      } else {
        await createMyJob(payload);
      }
      navigate("/recruiter", { state: { refreshJobs: Date.now() } });
    } catch (err) {
      setSubmitError(err?.response?.data?.detail || "Failed to save job. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading skeleton (edit mode)
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6 animate-fade-in">
        <div className="h-4 w-16 bg-white/5 rounded mb-6 animate-pulse" />
        <div className="h-8 w-1/2 bg-white/5 rounded mb-2 animate-pulse" />
        <div className="h-4 w-1/3 bg-white/5 rounded mb-8 animate-pulse" />
        <div className="space-y-4">
          <div className="h-40 bg-[var(--surface-4)] border border-[var(--border-soft)] rounded-2xl animate-pulse" />
          <div className="h-40 bg-[var(--surface-4)] border border-[var(--border-soft)] rounded-2xl animate-pulse" />
          <div className="h-40 bg-[var(--surface-4)] border border-[var(--border-soft)] rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  // Load error (e.g., 404)
  if (loadError) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6 animate-fade-in">
        <button
          onClick={() => navigate("/recruiter")}
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-white text-sm mb-6 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back
        </button>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-300">
          {loadError}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6 animate-fade-in">
      {/* Back button */}
      <button
        onClick={() => navigate("/recruiter")}
        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-white text-sm mb-6 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to dashboard
      </button>

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          {isEdit ? "Edit Job" : "Create New Job"}
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          {isEdit
            ? "Update the details of this role."
            : "Define a new role to start receiving applications."}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info */}
        <Section title="Basic Info">
          <Field label="Title" required>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="e.g. Senior Backend Engineer"
              className={inputCls}
              required
            />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Department">
              <input
                type="text"
                value={form.department}
                onChange={(e) => updateField("department", e.target.value)}
                placeholder="e.g. Engineering"
                className={inputCls}
              />
            </Field>
            <Field label="Location">
              <input
                type="text"
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="e.g. San Francisco, CA"
                className={inputCls}
              />
            </Field>
          </div>
        </Section>

        {/* Employment */}
        <Section title="Employment">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Employment type">
              <select
                value={form.employment_type}
                onChange={(e) => updateField("employment_type", e.target.value)}
                className={inputCls}
              >
                {EMPLOYMENT_TYPES.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[var(--surface-4)]">
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Work mode">
              <select
                value={form.work_mode}
                onChange={(e) => updateField("work_mode", e.target.value)}
                className={inputCls}
              >
                {WORK_MODES.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[var(--surface-4)]">
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Experience level">
              <select
                value={form.experience_level}
                onChange={(e) => updateField("experience_level", e.target.value)}
                className={inputCls}
              >
                {EXPERIENCE_LEVELS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[var(--surface-4)]">
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </Section>

        {/* Description */}
        <Section title="Description">
          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Describe the role, responsibilities, and what makes this opportunity great..."
              rows={6}
              className={`${inputCls} resize-y min-h-[140px]`}
            />
          </Field>
        </Section>

        {/* Skills */}
        <Section title="Required Skills" subtitle="Press Enter to add each skill.">
          <SkillInput
            skills={form.required_skills}
            onChange={(skills) => updateField("required_skills", skills)}
          />
        </Section>

        {/* Compensation */}
        <Section title="Compensation">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Salary min" hint="Annual">
              <input
                type="number"
                inputMode="numeric"
                min="0"
                value={form.salary_min}
                onChange={(e) => updateField("salary_min", e.target.value)}
                placeholder="80000"
                className={inputCls}
              />
            </Field>
            <Field label="Salary max" hint="Annual">
              <input
                type="number"
                inputMode="numeric"
                min="0"
                value={form.salary_max}
                onChange={(e) => updateField("salary_max", e.target.value)}
                placeholder="120000"
                className={inputCls}
              />
            </Field>
            <Field label="Currency">
              <input
                type="text"
                value={form.currency}
                onChange={(e) => updateField("currency", e.target.value)}
                placeholder="USD"
                maxLength={6}
                className={inputCls}
              />
            </Field>
          </div>
        </Section>

        {/* Status (edit only) */}
        {isEdit && (
          <Section title="Listing Status">
            <Field label="Status" hint="Closed jobs won't accept new applications.">
              <select
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
                className={inputCls}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[var(--surface-4)]">
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
          </Section>
        )}

        {/* Submit error */}
        {submitError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-300">
            {submitError}
          </div>
        )}

        {/* Save button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-[var(--accent-gold)] text-black hover:brightness-95 active:brightness-90 transition-all shadow-sm shadow-[var(--accent-gold)]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                {isEdit ? "Saving..." : "Creating..."}
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {isEdit ? "Save Changes" : "Create Job"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}