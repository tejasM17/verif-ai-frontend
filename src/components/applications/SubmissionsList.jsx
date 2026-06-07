import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, AlertCircle, RefreshCw,
  ExternalLink, Calendar,
} from 'lucide-react';
import { applicationService } from '../../services/applicationService';
import ApplicationStatusBadge from './ApplicationStatusBadge';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getTimeAgo(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
}

export default function SubmissionsList({ refreshKey }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubmissions = useCallback(() => {
    applicationService.getMyApplications()
      .then((res) => {
        const data = res.data;
        const list = data.applications || data.items || data || [];
        setSubmissions(list);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load submissions');
      });
  }, []);

  useEffect(() => {
    fetchSubmissions();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(false);
  }, [fetchSubmissions, refreshKey]);

  const isEmpty = !loading && !error && submissions.length === 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-dark-foreground">My Submissions</h2>
          <p className="text-sm text-dark-muted mt-0.5">
            Track your job and internship applications
          </p>
        </div>
        <button
          onClick={fetchSubmissions}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-dark-border px-3 py-2 text-xs font-medium text-dark-foreground hover:bg-dark-surface-hover disabled:opacity-50 transition-all duration-200"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {loading && submissions.length === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-dark-border bg-dark-surface p-4 animate-pulse"
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-dark-surface-hover flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 rounded bg-dark-surface-hover" />
                  <div className="h-3 w-24 rounded bg-dark-surface-hover" />
                  <div className="h-3 w-32 rounded bg-dark-surface-hover" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-error/20 bg-error/5 p-6 text-center"
        >
          <AlertCircle className="h-8 w-8 text-error mx-auto mb-3" />
          <p className="text-sm text-error font-medium">Failed to load submissions</p>
          <p className="text-xs text-dark-muted mt-1">{error}</p>
          <button
            onClick={fetchSubmissions}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </motion.div>
      ) : isEmpty ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="rounded-2xl bg-dark-surface-muted p-4 mb-4">
            <Send className="h-10 w-10 text-dark-muted" />
          </div>
          <h3 className="text-base font-semibold text-dark-foreground">No submissions yet</h3>
          <p className="text-sm text-dark-muted mt-1.5 max-w-xs">
            Browse companies and submit your first application to get started
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2.5"
        >
          <AnimatePresence>
            {submissions.map((sub, i) => (
              <SubmissionCard key={sub.id || sub.application_id || i} submission={sub} index={i} />
            ))}
          </AnimatePresence>
          <p className="text-center text-xs text-dark-muted pt-2">
            {submissions.length} {submissions.length === 1 ? 'submission' : 'submissions'}
          </p>
        </motion.div>
      )}
    </div>
  );
}

function SubmissionCard({ submission, index }) {
  const company = submission.company || {};
  const status = submission.status || 'submitted';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="group rounded-xl border border-dark-border bg-dark-surface p-4 hover:border-primary-500/20 hover:bg-dark-surface-hover transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-500/10 text-primary-400 font-bold text-sm">
          {(company.company_name || submission.company_name || '?')[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-dark-foreground truncate">
                {company.company_name || submission.company_name || 'Unknown Company'}
              </h4>
              <p className="text-xs text-dark-muted mt-0.5">
                {submission.job_title || submission.position || 'General Application'}
              </p>
            </div>
            <ApplicationStatusBadge status={status} size="sm" />
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-dark-muted">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(submission.created_at || submission.submitted_at)}
            </span>
            <span>{getTimeAgo(submission.created_at || submission.submitted_at)}</span>
            {submission.github_url && (
              <a
                href={submission.github_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-primary-400 hover:text-primary-300 transition-colors ml-auto"
              >
                <ExternalLink className="h-3 w-3" />
                Project
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
