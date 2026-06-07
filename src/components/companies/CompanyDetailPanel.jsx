import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MapPin, Briefcase, GraduationCap, Globe, ExternalLink,
  ChevronLeft, ChevronRight, Building2, Loader2, Send,
} from 'lucide-react';
import { companyService } from '../../services/companyService';
import ApplicationForm from '../applications/ApplicationForm';

const statusStyles = {
  hiring: 'bg-secondary-500/10 text-secondary-400 border-secondary-500/20',
  paused: 'bg-warning/10 text-warning border-warning/20',
  closed: 'bg-error/10 text-error border-error/20',
};

const statusLabel = {
  hiring: 'Actively Hiring',
  paused: 'Paused',
  closed: 'Not Hiring',
};

export default function CompanyDetailPanel({ companyId, onClose, onApplied }) {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('detail');

  useEffect(() => {
    if (!companyId) return;
    let cancelled = false;
    companyService.getCompany(companyId)
      .then((res) => {
        if (!cancelled) {
          setView('detail');
          setCompany(res.data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Failed to load company details');
        }
      });
    return () => { cancelled = true; };
  }, [companyId]);

  const handleApplied = () => {
    setView('detail');
    if (onApplied) onApplied();
  };

  return (
    <AnimatePresence>
      {companyId && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-lg border-l border-dark-border bg-dark-surface shadow-2xl overflow-y-auto"
          >
            {/* Sticky header */}
            <div className="sticky top-0 z-10 flex items-center justify-between bg-dark-surface/80 backdrop-blur-sm border-b border-dark-border px-5 py-4">
              <button
                onClick={view === 'apply' ? () => setView('detail') : onClose}
                className="flex items-center gap-2 text-sm text-dark-muted hover:text-dark-foreground transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                {view === 'apply' ? 'Back to Details' : 'Back'}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-dark-muted hover:bg-dark-surface-hover hover:text-dark-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-primary-400" />
                  <p className="text-sm text-dark-muted">Loading details...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                  <div className="rounded-xl bg-error/10 p-3">
                    <Building2 className="h-6 w-6 text-error" />
                  </div>
                  <p className="text-sm text-error font-medium">Failed to load</p>
                  <p className="text-xs text-dark-muted">{error}</p>
                  <button
                    onClick={() => {
                      setLoading(true);
                      setError(null);
                      companyService.getCompany(companyId)
                        .then((res) => setCompany(res.data))
                        .catch((err) => setError(err.message || 'Failed to load'))
                        .finally(() => setLoading(false));
                    }}
                    className="rounded-lg bg-primary-600 px-4 py-2 text-xs font-medium text-white hover:bg-primary-500 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : view === 'apply' && company ? (
                <ApplicationForm
                  companyId={companyId}
                  companyName={company.company_name}
                  onSuccess={handleApplied}
                  onCancel={() => setView('detail')}
                />
              ) : company ? (
                <div className="space-y-6">
                  {/* Company header */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-500/10 text-primary-400 font-bold text-xl">
                      {(company.company_name || '?')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-xl font-bold text-dark-foreground">
                        {company.company_name}
                      </h2>
                      {company.location && (
                        <p className="flex items-center gap-1.5 text-sm text-dark-muted mt-1">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          {company.location}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status badges */}
                  <div className="flex flex-wrap gap-2">
                    {company.hiring_status && (
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
                        statusStyles[company.hiring_status] || statusStyles.closed
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          company.hiring_status === 'hiring' ? 'bg-secondary-400' :
                          company.hiring_status === 'paused' ? 'bg-warning' : 'bg-error'
                        }`} />
                        {statusLabel[company.hiring_status] || company.hiring_status}
                      </span>
                    )}
                    {typeof company.has_internships === 'boolean' && (
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
                        company.has_internships
                          ? 'bg-secondary-500/10 text-secondary-400 border-secondary-500/20'
                          : 'bg-dark-surface-hover text-dark-muted border-dark-border'
                      }`}>
                        <GraduationCap className="h-3 w-3" />
                        {company.has_internships ? 'Internships' : 'No Internships'}
                      </span>
                    )}
                    {company.company_website && (
                      <a
                        href={company.company_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-dark-border bg-dark-surface-hover px-3 py-1 text-xs font-medium text-dark-foreground hover:border-primary-500/30 hover:text-primary-400 transition-colors"
                      >
                        <Globe className="h-3 w-3" />
                        Website
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </div>

                  {/* Description */}
                  {company.summary && (
                    <div>
                      <h3 className="text-xs font-semibold text-dark-muted uppercase tracking-wider mb-2">About</h3>
                      <p className="text-sm text-dark-foreground leading-relaxed">{company.summary}</p>
                    </div>
                  )}

                  {/* Recruiter info */}
                  {(company.recruiter_name || company.recruiter_email) && (
                    <div className="rounded-xl border border-dark-border bg-dark-surface-muted p-4">
                      <h3 className="text-xs font-semibold text-dark-muted uppercase tracking-wider mb-2">Recruiter</h3>
                      <div className="space-y-1.5">
                        {company.recruiter_name && (
                          <p className="text-sm text-dark-foreground font-medium">{company.recruiter_name}</p>
                        )}
                        {company.recruiter_email && (
                          <p className="text-sm text-dark-muted">{company.recruiter_email}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tech Stack */}
                  {company.tech_stack?.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-dark-muted uppercase tracking-wider mb-2">Tech Stack</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {company.tech_stack.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center rounded-lg bg-primary-500/10 px-2.5 py-1 text-xs font-medium text-primary-400"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Required Skills */}
                  {company.required_skills?.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-dark-muted uppercase tracking-wider mb-2">Required Skills</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {company.required_skills.map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center rounded-lg bg-dark-surface-hover px-2.5 py-1 text-xs font-medium text-dark-foreground"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Application Instructions */}
                  {company.application_instructions && (
                    <div className="rounded-xl border border-dark-border bg-dark-surface-muted p-4">
                      <h3 className="text-xs font-semibold text-dark-muted uppercase tracking-wider mb-2">Application Instructions</h3>
                      <p className="text-sm text-dark-foreground leading-relaxed whitespace-pre-wrap">{company.application_instructions}</p>
                    </div>
                  )}

                  {/* Open Positions */}
                  {company.open_positions !== undefined && (
                    <div className="rounded-xl border border-primary-500/20 bg-primary-500/5 p-4">
                      <div className="flex items-center gap-3">
                        <Briefcase className="h-5 w-5 text-primary-400" />
                        <div>
                          <p className="text-sm font-semibold text-dark-foreground">
                            {company.open_positions} {company.open_positions === 1 ? 'Open Position' : 'Open Positions'}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-primary-400 ml-auto" />
                      </div>
                    </div>
                  )}

                  {/* Job postings */}
                  {company.postings?.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-dark-muted uppercase tracking-wider mb-3">Open Positions</h3>
                      <div className="space-y-2">
                        {company.postings.map((posting) => (
                          <div
                            key={posting.id}
                            className="rounded-lg border border-dark-border bg-dark-surface-muted p-3.5 hover:border-primary-500/20 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-medium text-dark-foreground">{posting.title}</p>
                                <p className="text-xs text-dark-muted mt-0.5">
                                  {posting.type === 'internship' ? 'Internship' : 'Job'}
                                  {posting.location && ` \u00B7 ${posting.location}`}
                                  {posting.is_remote && ' \u00B7 Remote'}
                                </p>
                              </div>
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                posting.status === 'open'
                                  ? 'bg-secondary-500/10 text-secondary-400'
                                  : 'bg-dark-surface-hover text-dark-muted'
                              }`}>
                                {posting.status === 'open' ? 'Open' : posting.status}
                              </span>
                            </div>
                            {posting.stipend_salary && (
                              <p className="text-xs text-dark-foreground mt-2 font-medium">
                                {posting.stipend_salary}
                              </p>
                            )}
                            {posting.description && (
                              <p className="text-xs text-dark-muted mt-1.5 line-clamp-2">
                                {posting.description}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-1 mt-2">
                              {posting.tech_stack?.slice(0, 3).map((t) => (
                                <span key={t} className="text-[10px] rounded bg-primary-500/8 px-1.5 py-0.5 text-primary-400">{t}</span>
                              ))}
                              {posting.tech_stack?.length > 3 && (
                                <span className="text-[10px] text-dark-muted">+{posting.tech_stack.length - 3} more</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Apply button */}
                  <div className="sticky bottom-0 -mx-5 -mb-5 mt-6 bg-dark-surface/95 backdrop-blur-sm border-t border-dark-border px-5 py-4">
                    <button
                      onClick={() => setView('apply')}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 py-3 text-sm font-semibold text-white hover:bg-primary-500 transition-all duration-200 active:scale-[0.98] shadow-lg shadow-primary-500/10"
                    >
                      <Send className="h-4 w-4" />
                      Apply Now
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
