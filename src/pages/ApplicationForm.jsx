/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  getCompany,
  getCompanyLogoUrl,
  getJob,
  getResumeInfo,
  uploadResume,
  submitApplication,
} from "../api/auth";
import { useAuth } from "../hooks/useAuth";

function initials(name) {
  if (!name) return "C";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ResumeIcon() {
  return (
    <svg
      className="w-5 h-5 text-yellow-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
      />
    </svg>
  );
}

const MAX_RESUME_BYTES = 5 * 1024 * 1024;

export default function ApplicationForm() {
  const { uid: companyUid } = useParams();
  const [searchParams] = useSearchParams();
  const jobUid = searchParams.get("job") || null;
  const navigate = useNavigate();
  const { user } = useAuth();

  const [company, setCompany] = useState(null);
  const [job, setJob] = useState(null);
  const [resumeInfo, setResumeInfo] = useState(null);
  const [resumeLoaded, setResumeLoaded] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [email, setEmail] = useState(user?.email || "");
  const [whyAppoint, setWhyAppoint] = useState("");
  const [pendingResume, setPendingResume] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const resumeInputRef = useRef(null);
  const inFlightSubmitRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    setInitialLoading(true);
    setError(null);
    setLogoFailed(false);

    const promises = [
      getCompany(companyUid).catch(() => null),
      getResumeInfo().then((res) => res).catch(() => null),
    ];
    if (jobUid) {
      promises.push(getJob(jobUid).catch(() => null));
    }

    Promise.all(promises)
      .then((results) => {
        if (cancelled) return;
        const [companyRes, resumeRes, jobRes] = results;
        setCompany(companyRes?.data || null);
        if (resumeRes && resumeRes.data) {
          setResumeInfo(resumeRes.data);
        } else {
          setResumeInfo(null);
        }
        setResumeLoaded(true);
        if (jobUid) setJob(jobRes?.data || null);
      })
      .finally(() => {
        if (!cancelled) setInitialLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [companyUid, jobUid]);

  useEffect(() => {
    if (user?.email && !email) setEmail(user.email);
  }, [user, email]);

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_RESUME_BYTES) {
      setError("File size must be less than 5 MB");
      if (resumeInputRef.current) resumeInputRef.current.value = "";
      return;
    }
    setError(null);
    setPendingResume(file);
  };

  const validate = () => {
    const emailTrimmed = email.trim();
    if (!EMAIL_REGEX.test(emailTrimmed)) {
      setError("Please enter a valid email address.");
      return false;
    }
    const trimmed = whyAppoint.trim();
    if (trimmed.length < 50) {
      setError("Please write at least 50 characters explaining why you're a great fit.");
      return false;
    }
    if (trimmed.length > 1000) {
      setError("Your message must be 1000 characters or fewer.");
      return false;
    }
    if (!resumeInfo && !pendingResume) {
      setError("Please upload a resume before submitting your application.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inFlightSubmitRef.current) return;
    setError(null);
    if (!validate()) return;

    const resumeToUpload =
      pendingResume ||
      (resumeInputRef.current?.files && resumeInputRef.current.files[0]) ||
      null;

    inFlightSubmitRef.current = true;
    setSubmitting(true);
    try {
      let resumeMeta = resumeInfo;
      if (resumeToUpload) {
        try {
          const uploadRes = await uploadResume(resumeToUpload);
          resumeMeta = uploadRes?.data || resumeMeta;
          setResumeInfo(resumeMeta);
          if (resumeInputRef.current) resumeInputRef.current.value = "";
        } catch (uploadErr) {
          const detail =
            uploadErr?.response?.data?.detail ||
            uploadErr?.message ||
            "Resume upload failed. Please try again.";
          throw new Error(`Resume upload failed: ${detail}`, { cause: uploadErr });
        }
      }

      const studentUid = user?.uid;
      if (!studentUid) {
        throw new Error("You must be signed in to apply. Please log in and try again.");
      }

      await submitApplication({
        resume_uid: studentUid,
        company_uid: companyUid,
        why_appoint: whyAppoint.trim(),
        ...(jobUid ? { job_uid: jobUid } : {}),
      });

      setPendingResume(null);
      navigate("/student/applied");
    } catch (err) {
      const isNetwork = !err?.response && (err?.message?.toLowerCase().includes("network") || err?.code === "ERR_NETWORK");
      const msg = err?.response?.data?.detail
        || (isNetwork ? "Network error. Check your connection and try again." : null)
        || err?.message
        || "Failed to submit application. Please try again.";
      setError(msg);
    } finally {
      inFlightSubmitRef.current = false;
      setSubmitting(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="max-w-2xl mx-auto py-6 sm:py-10 px-4 sm:px-6 animate-fade-in">
        <div className="h-4 w-16 bg-white/5 rounded mb-6 animate-pulse" />
        <div className="bg-[var(--surface-4)] border border-[var(--border-soft)] rounded-2xl p-6 sm:p-8 animate-pulse">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/5" />
            <div className="flex-1 space-y-3">
              <div className="h-5 w-1/2 bg-white/5 rounded" />
              <div className="h-4 w-1/3 bg-white/5 rounded" />
            </div>
          </div>
        </div>
        <div className="h-64 mt-6 bg-[var(--surface-4)] border border-[var(--border-soft)] rounded-2xl animate-pulse" />
      </div>
    );
  }

  const companyName = company?.company_name || "this company";
  const headerLogoUrl = company?.logo_url && !logoFailed ? company.logo_url : getCompanyLogoUrl(companyUid);
  const headerInitial = initials(companyName);

  const whyChars = whyAppoint.length;
  const whyTooLong = whyChars > 1000;
  const effectiveResumeName = pendingResume?.name || resumeInfo?.filename;

  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-10 px-4 sm:px-6 animate-fade-in">
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

      <section className="bg-[var(--surface-4)] border border-[var(--border-soft)] rounded-2xl overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-amber-900/60 via-amber-800/40 to-amber-950/30" />
        <div className="px-6 pb-6">
          <div className="flex items-end gap-5 -mt-10">
            <div className="w-20 h-20 rounded-2xl border-4 border-[var(--surface-4)] bg-[var(--surface-3)] flex items-center justify-center overflow-hidden flex-shrink-0">
              {headerLogoUrl ? (
                <img
                  src={headerLogoUrl}
                  alt={companyName}
                  className="w-full h-full object-cover"
                  onError={() => setLogoFailed(true)}
                />
              ) : (
                <div className="w-full h-full bg-[var(--accent-gold)] flex items-center justify-center text-black font-bold text-2xl">
                  {headerInitial}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <h1 className="text-xl sm:text-2xl font-bold text-white break-words">
                {job?.title
                  ? `Applying for ${job.title}`
                  : `Applying to ${companyName}`}
              </h1>
              <p className="text-[13px] text-[var(--text-secondary)] mt-1 truncate">
                {job?.title ? companyName : "Company-wide application"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="mt-5 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-[13px] text-red-300 flex items-start gap-2 animate-fade-in">
          <svg
            className="w-4 h-4 mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
          <span className="break-words">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        <section className="bg-[var(--surface-4)] border border-[var(--border-soft)] rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 rounded-full bg-[var(--accent-gold)]" />
            <h2 className="text-[15px] font-semibold text-white">Resume</h2>
          </div>

          <input
            ref={resumeInputRef}
            type="file"
            accept=".pdf,.doc,.docx,image/png,image/jpeg,image/jpg"
            className="hidden"
            onChange={handleResumeChange}
          />

          {effectiveResumeName ? (
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-[var(--surface-3)] border border-[var(--border-soft)]">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                <ResumeIcon />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{effectiveResumeName}</p>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  {pendingResume ? "Ready to upload on submit" : "Currently on file"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => resumeInputRef.current?.click()}
                disabled={submitting}
                className="px-3 py-1.5 rounded-lg text-xs text-[var(--text-secondary)] hover:text-white border border-gray-700/50 hover:border-gray-600 transition-colors"
              >
                Replace
              </button>
            </div>
          ) : resumeLoaded ? (
            <div className="rounded-xl border border-dashed border-[var(--border-soft)] bg-[var(--surface-3)] p-5 flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <ResumeIcon />
              </div>
              <p className="text-[13px] text-white font-medium">No resume uploaded</p>
              <p className="text-[11px] text-[var(--text-muted)] text-center max-w-sm">
                Recruiters strongly prefer applicants who attach a resume. PDF, DOC, or image — max 5 MB.
              </p>
              <button
                type="button"
                onClick={() => resumeInputRef.current?.click()}
                disabled={submitting}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                Upload Resume
              </button>
            </div>
          ) : null}
        </section>

        <section className="bg-[var(--surface-4)] border border-[var(--border-soft)] rounded-2xl p-5 sm:p-6">
          <label htmlFor="apply-email" className="block">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-5 rounded-full bg-[var(--accent-gold)]" />
              <h2 className="text-[15px] font-semibold text-white">Email</h2>
            </div>
            <input
              id="apply-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={submitting}
              className="w-full bg-black/40 border border-gray-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50"
            />
          </label>
        </section>

        <section className="bg-[var(--surface-4)] border border-[var(--border-soft)] rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 rounded-full bg-[var(--accent-gold)]" />
              <h2 className="text-[15px] font-semibold text-white">Why should we hire you?</h2>
            </div>
            <span
              className={`text-[11px] tabular-nums ${
                whyTooLong ? "text-red-400" : "text-[var(--text-muted)]"
              }`}
            >
              {whyChars} / 1000
            </span>
          </div>
          <textarea
            value={whyAppoint}
            onChange={(e) => setWhyAppoint(e.target.value)}
            rows={6}
            required
            disabled={submitting}
            placeholder="Tell the team about your experience, what excites you about this role, and what you'd bring to the table..."
            className="w-full bg-black/40 border border-gray-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 resize-y min-h-[140px]"
          />
          {whyChars > 0 && whyChars < 50 && (
            <p className="mt-2 text-[11px] text-[var(--text-muted)]">
              At least 50 characters required ({50 - whyChars} more).
            </p>
          )}
        </section>

        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-[15px] bg-[var(--accent-gold)] text-black hover:brightness-95 active:brightness-90 transition-all shadow-sm shadow-[var(--accent-gold)]/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
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
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
              Submit Application
            </>
          )}
        </button>
      </form>
    </div>
  );
}
