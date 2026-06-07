import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
  Mail,
  Calendar,
  Building2,
  FileText,
  User,
} from 'lucide-react';
import recruiterService from '../../services/recruiterService';
import ApplicationStatusBadge from '../applications/ApplicationStatusBadge';
import { InboxSkeleton } from './RecruiterSkeletons';

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'score', label: 'Score' },
  { value: 'status', label: 'Status' },
];

const statusFilters = [
  { value: '', label: 'All Status' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'selected', label: 'Selected' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'request_changes', label: 'Changes Requested' },
];

export default function ApplicationInbox({ onSelectApplication, refreshKey }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (statusFilter) params.status = statusFilter;
      if (sortBy) params.sort_by = sortBy;

      const res = await recruiterService.getApplications(params);
      const data = res.data || res;
      setApplications(Array.isArray(data) ? data : data.applications || []);
    } catch (err) {
      setError(err.message || 'Failed to load applications');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, sortBy]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications, refreshKey]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-muted" />
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-dark-border bg-dark-surface pl-10 pr-4 py-2.5 text-sm text-dark-foreground placeholder:text-dark-muted focus:border-primary-500/50 focus:outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-muted pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none rounded-lg border border-dark-border bg-dark-surface pl-10 pr-8 py-2.5 text-sm text-dark-foreground focus:border-primary-500/50 focus:outline-none transition-colors cursor-pointer"
            >
              {statusFilters.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-muted pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none rounded-lg border border-dark-border bg-dark-surface pl-10 pr-8 py-2.5 text-sm text-dark-foreground focus:border-primary-500/50 focus:outline-none transition-colors cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <InboxSkeleton />
      ) : error ? (
        <div className="rounded-xl border border-error/20 bg-error/5 p-8 text-center">
          <p className="text-error font-medium mb-2">Failed to load applications</p>
          <p className="text-sm text-dark-muted mb-4">{error}</p>
          <button
            onClick={fetchApplications}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : applications.length === 0 ? (
        <div className="rounded-xl border border-dark-border bg-dark-surface p-8 text-center">
          <InboxIcon />
          <h3 className="text-lg font-semibold text-dark-foreground mb-1">No applications yet</h3>
          <p className="text-sm text-dark-muted">Applications from students will appear here</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {applications.map((app, index) => (
              <motion.button
                key={app.id || index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => onSelectApplication && onSelectApplication(app)}
                className="w-full text-left rounded-xl border border-dark-border bg-dark-surface p-4 hover:border-primary-500/30 hover:bg-dark-surface-hover transition-all duration-200 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500/20 to-purple-600/20 flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-primary-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-semibold text-dark-foreground">
                          {app.student_name || app.student?.full_name || 'Unknown Student'}
                        </h4>
                        <ApplicationStatusBadge status={app.status} size="sm" />
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-dark-muted flex-wrap">
                        <span className="inline-flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {app.student_email || app.student?.email || 'No email'}
                        </span>
                        {app.company_name && (
                          <span className="inline-flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {app.company_name}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {app.created_at ? new Date(app.created_at).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {app.resume_url && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-primary-400">
                            <FileText className="h-3 w-3" /> Resume
                          </span>
                        )}
                        {app.verification?.overall_score != null && (
                          <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full ${
                            app.verification.overall_score >= 70
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : app.verification.overall_score >= 40
                                ? 'bg-amber-500/10 text-amber-400'
                                : 'bg-error/10 text-error'
                          }`}>
                            Score: {Math.round(app.verification.overall_score)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-dark-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function InboxIcon() {
  return (
    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-dark-surface-muted">
      <Search className="h-6 w-6 text-dark-muted" />
    </div>
  );
}
