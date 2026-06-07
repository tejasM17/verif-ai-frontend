import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, AlertCircle, CheckCircle, Clock,
  Loader2, X, GitBranch, FileWarning,
} from 'lucide-react';
import { applicationService } from '../../services/applicationService';

const ALLOWED_RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
];
const ALLOWED_CERT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateFile(file, allowedTypes) {
  if (!file) return null;
  if (!allowedTypes.includes(file.type)) {
    return 'Invalid file type. Please upload a supported format.';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'File is too large. Maximum size is 10 MB.';
  }
  return null;
}

function validateGithubUrl(url) {
  if (!url || !url.trim()) return 'GitHub project link is required';
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return 'URL must start with http:// or https://';
    }
    if (!parsed.hostname.toLowerCase().includes('github.com')) {
      return 'Must be a GitHub URL';
    }
    return null;
  } catch {
    return 'Please enter a valid URL';
  }
}

export default function ApplicationForm({ companyId, companyName, onSuccess, onCancel }) {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeError, setResumeError] = useState(null);
  const [certFile, setCertFile] = useState(null);
  const [certError, setCertError] = useState(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [githubError, setGithubError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(false);
  const resumeRef = useRef(null);
  const certRef = useRef(null);

  const handleResumeSelect = useCallback((file) => {
    setResumeError(null);
    const err = validateFile(file, ALLOWED_RESUME_TYPES);
    if (err) {
      setResumeError(err);
      setResumeFile(null);
      return;
    }
    setResumeFile(file);
  }, []);

  const handleCertSelect = useCallback((file) => {
    setCertError(null);
    if (!file) {
      setCertFile(null);
      return;
    }
    const err = validateFile(file, ALLOWED_CERT_TYPES);
    if (err) {
      setCertError(err);
      setCertFile(null);
      return;
    }
    setCertFile(file);
  }, []);

  const validate = useCallback(() => {
    let valid = true;
    if (!resumeFile) {
      setResumeError('Resume is required');
      valid = false;
    }
    const gErr = validateGithubUrl(githubUrl);
    if (gErr) {
      setGithubError(gErr);
      valid = false;
    }
    return valid;
  }, [resumeFile, githubUrl]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;
    setSubmitting(true);
    setUploadProgress(0);
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + Math.random() * 15, 85));
    }, 300);
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      if (certFile) formData.append('certificate', certFile);
      formData.append('github_url', githubUrl.trim());
      await applicationService.submit(companyId, formData);
      clearInterval(progressInterval);
      setUploadProgress(100);
      await new Promise((r) => setTimeout(r, 400));
      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err) {
      clearInterval(progressInterval);
      setSubmitError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [companyId, resumeFile, certFile, githubUrl, validate, onSuccess]);

  const handleDrop = useCallback((e, type) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (type === 'resume') handleResumeSelect(file);
    else handleCertSelect(file);
  }, [handleResumeSelect, handleCertSelect]);

  return (
    <AnimatePresence mode="wait">
      {success ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="rounded-2xl bg-secondary-500/10 p-4 mb-5">
            <CheckCircle className="h-10 w-10 text-secondary-400" />
          </div>
          <h3 className="text-lg font-bold text-dark-foreground">Application Submitted!</h3>
          <p className="text-sm text-dark-muted mt-2 max-w-sm">
            Your application for <span className="text-dark-foreground font-medium">{companyName}</span> has been received. The recruiter will review it shortly.
          </p>
          <div className="flex items-center gap-2 mt-4 text-xs text-dark-muted">
            <Clock className="h-3.5 w-3.5" />
            You can track the status in My Submissions
          </div>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <h3 className="text-base font-semibold text-dark-foreground">
              Apply to {companyName}
            </h3>
            <p className="text-xs text-dark-muted mt-1">
              Fill out the details below to submit your application
            </p>
          </div>

          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-error/20 bg-error/10 p-3 flex items-start gap-2.5"
            >
              <AlertCircle className="h-4 w-4 text-error shrink-0 mt-0.5" />
              <p className="text-xs text-error">{submitError}</p>
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-dark-foreground mb-1.5">
              Resume <span className="text-error">*</span>
            </label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, 'resume')}
              onClick={() => resumeRef.current?.click()}
              className={`relative cursor-pointer rounded-xl border-2 border-dashed p-5 text-center transition-all duration-200 ${
                resumeFile
                  ? 'border-secondary-500/30 bg-secondary-500/5'
                  : resumeError
                    ? 'border-error/30 bg-error/5'
                    : 'border-dark-border hover:border-primary-500/30 bg-dark-surface-muted hover:bg-dark-surface-hover'
              }`}
            >
              <input
                ref={resumeRef}
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files[0]) handleResumeSelect(e.target.files[0]);
                }}
              />
              {resumeFile ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="rounded-lg bg-secondary-500/10 p-2">
                    <FileText className="h-5 w-5 text-secondary-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-dark-foreground truncate max-w-[200px]">
                      {resumeFile.name}
                    </p>
                    <p className="text-xs text-dark-muted">
                      {formatFileSize(resumeFile.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setResumeFile(null);
                      setResumeError(null);
                    }}
                    className="rounded-lg p-1.5 text-dark-muted hover:bg-dark-surface-hover hover:text-error transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <div className="rounded-lg bg-primary-500/10 p-2.5 inline-flex mb-2">
                    <Upload className="h-5 w-5 text-primary-400" />
                  </div>
                  <p className="text-sm text-dark-foreground font-medium">
                    Drop your resume here or click to browse
                  </p>
                  <p className="text-xs text-dark-muted mt-1">
                    PDF, DOC, DOCX, JPG, PNG (max 10 MB)
                  </p>
                </div>
              )}
            </div>
            {resumeError && (
              <motion.p
                initial={{ opacity: 0, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1 mt-1.5 text-xs text-error"
              >
                <FileWarning className="h-3 w-3" />
                {resumeError}
              </motion.p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-foreground mb-1.5">
              Certificate <span className="text-dark-muted text-xs">(optional)</span>
            </label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, 'cert')}
              onClick={() => certRef.current?.click()}
              className={`relative cursor-pointer rounded-xl border-2 border-dashed p-5 text-center transition-all duration-200 ${
                certFile
                  ? 'border-primary-500/30 bg-primary-500/5'
                  : certError
                    ? 'border-error/30 bg-error/5'
                    : 'border-dark-border hover:border-primary-500/30 bg-dark-surface-muted hover:bg-dark-surface-hover'
              }`}
            >
              <input
                ref={certRef}
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files[0]) handleCertSelect(e.target.files[0]);
                }}
              />
              {certFile ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="rounded-lg bg-primary-500/10 p-2">
                    <FileText className="h-5 w-5 text-primary-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-dark-foreground truncate max-w-[200px]">
                      {certFile.name}
                    </p>
                    <p className="text-xs text-dark-muted">
                      {formatFileSize(certFile.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCertFile(null);
                      setCertError(null);
                    }}
                    className="rounded-lg p-1.5 text-dark-muted hover:bg-dark-surface-hover hover:text-error transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2.5">
                  <Upload className="h-4 w-4 text-dark-muted" />
                  <p className="text-sm text-dark-muted">
                    Add a certificate (optional)
                  </p>
                </div>
              )}
            </div>
            {certError && (
              <motion.p
                initial={{ opacity: 0, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1 mt-1.5 text-xs text-error"
              >
                <FileWarning className="h-3 w-3" />
                {certError}
              </motion.p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-foreground mb-1.5">
              GitHub Project Link <span className="text-error">*</span>
            </label>
            <div className={`relative rounded-lg border transition-all duration-200 ${
              githubError
                ? 'border-error/60'
                : 'border-dark-border focus-within:border-primary-500/50'
            }`}>
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <GitBranch className={`h-4 w-4 ${githubError ? 'text-error' : 'text-dark-muted'}`} />
              </div>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => {
                  setGithubUrl(e.target.value);
                  if (githubError) setGithubError(null);
                }}
                placeholder="https://github.com/username/project"
                className="w-full bg-dark-surface py-2.5 pl-10 pr-3 text-sm text-dark-foreground placeholder:text-dark-muted rounded-lg outline-none"
              />
            </div>
            {githubError && (
              <motion.p
                initial={{ opacity: 0, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1 mt-1.5 text-xs text-error"
              >
                <AlertCircle className="h-3 w-3" />
                {githubError}
              </motion.p>
            )}
          </div>

          {/* Progress bar */}
          <AnimatePresence>
            {submitting && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-dark-muted">Uploading...</span>
                  <span className="text-xs text-dark-muted">{Math.round(uploadProgress)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-dark-surface-hover overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 py-2.5 text-sm font-medium text-white hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Submit Application
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="rounded-lg border border-dark-border px-4 py-2.5 text-sm font-medium text-dark-foreground hover:bg-dark-surface-hover disabled:opacity-50 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
