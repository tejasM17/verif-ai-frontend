import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Award,
  GitBranch,
  ExternalLink,
  Calendar,
  Clock,
  Building2,
  GraduationCap,
  Globe,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import recruiterService from '../../services/recruiterService';
import ApplicationStatusBadge from '../applications/ApplicationStatusBadge';
import StatusUpdateControls from './StatusUpdateControls';
import AIVerificationPanel from './AIVerificationPanel';
import { DetailPanelSkeleton } from './RecruiterSkeletons';

export default function ApplicationDetailPanel({
  application,
  onClose,
  onStatusUpdate,
}) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [saving, setSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState(null);
  const [verification, setVerification] = useState(null);
  const [verificationLoading, setVerificationLoading] = useState(false);

  useEffect(() => {
    if (!application?.id) return;
    setDetail(null);
    setError(null);
    setActiveTab('overview');
    setVerification(null);
    setSavedStatus(null);

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await recruiterService.getApplication(application.id);
        const data = res.data || res;
        setDetail(data);
        setSavedStatus(data.status);
      } catch (err) {
        setError(err.message || 'Failed to load application detail');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [application?.id]);

  useEffect(() => {
    if (!application?.id || activeTab !== 'verification') return;

    const fetchVerification = async () => {
      setVerificationLoading(true);
      try {
        const res = await recruiterService.getVerification(application.id);
        const data = res.data || res;
        setVerification(data);
      } catch (err) {
        if (err.status !== 404) {
          console.error('Failed to load verification:', err);
        }
      } finally {
        setVerificationLoading(false);
      }
    };

    fetchVerification();
  }, [application?.id, activeTab]);

  const handleStatusSave = async (newStatus) => {
    setSaving(true);
    try {
      await recruiterService.updateApplicationStatus(application.id, newStatus);
      setSavedStatus(newStatus);
      if (detail) setDetail({ ...detail, status: newStatus });
      if (onStatusUpdate) onStatusUpdate(application.id, newStatus);
    } catch (err) {
      throw err;
    } finally {
      setSaving(false);
    }
  };

  if (!application) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 40 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="h-full flex flex-col bg-dark-surface border-l border-dark-border"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-dark-border flex-shrink-0">
          <h2 className="text-sm font-semibold text-dark-foreground">Application Detail</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-dark-muted hover:bg-dark-surface-hover hover:text-dark-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-5">
              <DetailPanelSkeleton />
            </div>
          ) : error ? (
            <div className="p-5">
              <div className="rounded-xl border border-error/20 bg-error/5 p-6 text-center">
                <p className="text-error font-medium mb-2">Error</p>
                <p className="text-sm text-dark-muted">{error}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="px-5 py-4 border-b border-dark-border">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-500/20 to-purple-600/20 flex items-center justify-center flex-shrink-0">
                    <User className="h-6 w-6 text-primary-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-dark-foreground truncate">
                      {detail?.student_name || application.student_name || 'Unknown'}
                    </h3>
                    <p className="text-xs text-dark-muted mt-0.5 truncate">
                      {detail?.student_email || application.student_email || ''}
                    </p>
                    <div className="mt-2">
                      <ApplicationStatusBadge status={savedStatus || detail?.status || application.status} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex border-b border-dark-border">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'verification', label: 'Verification' },
                  { id: 'timeline', label: 'Timeline' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 text-xs font-medium transition-colors relative ${
                      activeTab === tab.id
                        ? 'text-primary-400'
                        : 'text-dark-muted hover:text-dark-foreground'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="detailTab"
                        className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-primary-500 rounded-full"
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-5 space-y-5">
                {activeTab === 'overview' && (
                  <>
                    <DetailSection title="Student Information">
                      <InfoRow icon={Mail} label="Email" value={detail?.student_email || application.student_email} />
                      <InfoRow icon={Phone} label="Phone" value={detail?.student_phone || detail?.phone || '--'} />
                      <InfoRow icon={MapPin} label="Location" value={detail?.student_location || detail?.location || '--'} />
                      <InfoRow icon={GraduationCap} label="University" value={detail?.student_university || detail?.university || '--'} />
                      <InfoRow icon={BookOpen} label="Major" value={detail?.student_major || detail?.major || '--'} />
                    </DetailSection>

                    <DetailSection title="Documents & Links">
                      {(detail?.resume_url || application.resume_url) && (
                        <a
                          href={detail?.resume_url || application.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-lg bg-dark-surface-muted border border-dark-border px-3 py-2.5 hover:border-primary-500/30 transition-colors group"
                        >
                          <FileText className="h-4 w-4 text-primary-400" />
                          <span className="flex-1 text-sm text-dark-foreground truncate">View Resume</span>
                          <ExternalLink className="h-3.5 w-3.5 text-dark-muted group-hover:text-primary-400 transition-colors" />
                        </a>
                      )}

                      {(detail?.certificate_url || application.certificate_url) && (
                        <a
                          href={detail?.certificate_url || application.certificate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-lg bg-dark-surface-muted border border-dark-border px-3 py-2.5 hover:border-emerald-500/30 transition-colors group"
                        >
                          <Award className="h-4 w-4 text-emerald-400" />
                          <span className="flex-1 text-sm text-dark-foreground truncate">View Certificate</span>
                          <ExternalLink className="h-3.5 w-3.5 text-dark-muted group-hover:text-emerald-400 transition-colors" />
                        </a>
                      )}

                      {(detail?.github_url || application.github_url) && (
                        <a
                          href={detail?.github_url || application.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-lg bg-dark-surface-muted border border-dark-border px-3 py-2.5 hover:border-purple-500/30 transition-colors group"
                        >
                          <GitBranch className="h-4 w-4 text-purple-400" />
                          <span className="flex-1 text-sm text-dark-foreground truncate">{detail?.github_url || application.github_url}</span>
                          <ExternalLink className="h-3.5 w-3.5 text-dark-muted group-hover:text-purple-400 transition-colors" />
                        </a>
                      )}

                      {!detail?.resume_url && !detail?.certificate_url && !detail?.github_url &&
                       !application.resume_url && !application.certificate_url && !application.github_url && (
                        <p className="text-xs text-dark-muted text-center py-3">No documents uploaded</p>
                      )}
                    </DetailSection>

                    <DetailSection title="Status Management">
                      <StatusUpdateControls
                        currentStatus={savedStatus || detail?.status || application.status}
                        onSave={handleStatusSave}
                        saving={saving}
                        savedStatus={savedStatus}
                      />
                    </DetailSection>
                  </>
                )}

                {activeTab === 'verification' && (
                  <AIVerificationPanel
                    verification={verification}
                    loading={verificationLoading}
                    isRunning={verification?.status === 'running' || verification?.status === 'processing'}
                  />
                )}

                {activeTab === 'timeline' && (
                  <StatusTimeline
                    status={savedStatus || detail?.status || application.status}
                    timestamps={detail?.status_timeline || detail?.timeline || []}
                    createdAt={detail?.created_at || application.created_at}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function DetailSection({ title, children }) {
  return (
    <div>
      <h4 className="text-xs font-semibold text-dark-foreground uppercase tracking-wider mb-3">{title}</h4>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-dark-surface-muted flex-shrink-0">
        <Icon className="h-3.5 w-3.5 text-dark-muted" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-dark-muted">{label}</p>
        <p className="text-sm text-dark-foreground truncate">{value || '--'}</p>
      </div>
    </div>
  );
}

function StatusTimeline({ status, timestamps, createdAt }) {
  const timelineItems = [];

  if (createdAt) {
    timelineItems.push({
      status: 'submitted',
      date: createdAt,
      label: 'Application Submitted',
    });
  }

  if (timestamps && timestamps.length > 0) {
    timestamps.forEach((t) => {
      if (t.status !== 'submitted') {
        timelineItems.push({
          status: t.status,
          date: t.changed_at || t.timestamp,
          label: `Status changed to ${t.status?.replace(/_/g, ' ')}`,
        });
      }
    });
  }

  if (timelineItems.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="mx-auto h-8 w-8 text-dark-muted mb-2" />
        <p className="text-sm text-dark-muted">No timeline data available</p>
      </div>
    );
  }

  const statusColors = {
    submitted: 'bg-blue-400',
    reviewing: 'bg-yellow-400',
    selected: 'bg-emerald-400',
    rejected: 'bg-error',
    request_changes: 'bg-amber-400',
  };

  return (
    <div>
      <h4 className="text-xs font-semibold text-dark-foreground uppercase tracking-wider mb-4">Status Timeline</h4>
      <div className="relative">
        <div className="absolute left-[11px] top-0 bottom-0 w-px bg-dark-border" />
        <div className="space-y-4">
          {timelineItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative pl-8"
            >
              <div className={`absolute left-[6px] top-[4px] h-[11px] w-[11px] rounded-full border-2 border-dark-surface ${
                statusColors[item.status] || 'bg-dark-muted'
              }`} />
              <div>
                <p className="text-sm font-medium text-dark-foreground capitalize">{item.label}</p>
                <p className="text-xs text-dark-muted mt-0.5">
                  {item.date ? new Date(item.date).toLocaleString() : '--'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
