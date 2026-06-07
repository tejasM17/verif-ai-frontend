import { motion } from 'framer-motion';
import {
  FileText,
  Award,
  GitBranch,
  BarChart3,
  Shield,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { VerificationSkeleton } from './RecruiterSkeletons';
import ResearchLogTimeline from './ResearchLogTimeline';

const scoreColors = (score) => {
  if (score == null) return { text: 'text-dark-muted', bg: 'bg-dark-surface-muted', bar: 'bg-dark-muted' };
  if (score >= 80) return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', bar: 'bg-emerald-400' };
  if (score >= 60) return { text: 'text-primary-400', bg: 'bg-primary-500/10', bar: 'bg-primary-400' };
  if (score >= 40) return { text: 'text-amber-400', bg: 'bg-amber-500/10', bar: 'bg-amber-400' };
  return { text: 'text-error', bg: 'bg-error/10', bar: 'bg-error' };
};

const verdictConfig = {
  verified: { icon: CheckCircle2, text: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Verified' },
  likely_verified: { icon: Shield, text: 'text-primary-400', bg: 'bg-primary-500/10', label: 'Likely Verified' },
  uncertain: { icon: AlertTriangle, text: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Uncertain' },
  suspicious: { icon: XCircle, text: 'text-error', bg: 'bg-error/10', label: 'Suspicious' },
};

const scoreItems = [
  { key: 'resume_score', label: 'Resume Score', icon: FileText },
  { key: 'certificate_score', label: 'Certificate Score', icon: Award },
  { key: 'github_score', label: 'GitHub Score', icon: GitBranch },
  { key: 'overall_score', label: 'Overall Score', icon: BarChart3 },
];

export default function AIVerificationPanel({ verification, loading, isRunning }) {
  if (loading && !verification) {
    return (
      <div className="rounded-xl border border-dark-border bg-dark-surface p-5">
        <h3 className="text-sm font-semibold text-dark-foreground mb-4">AI Verification</h3>
        <VerificationSkeleton />
      </div>
    );
  }

  if (!verification && !isRunning) {
    return (
      <div className="rounded-xl border border-dark-border bg-dark-surface p-5">
        <h3 className="text-sm font-semibold text-dark-foreground mb-4">AI Verification</h3>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-dark-surface-muted mb-3">
            <Shield className="h-6 w-6 text-dark-muted" />
          </div>
          <p className="text-sm text-dark-muted">Verification pending</p>
          <p className="text-xs text-dark-muted mt-1">AI analysis will appear once processing completes</p>
        </div>
      </div>
    );
  }

  const getScore = (key) => {
    if (!verification) return null;
    const val = verification[key];
    return val != null ? Math.round(val) : null;
  };

  const vc = verdictConfig[verification?.verdict] || verdictConfig.uncertain;
  const VerdictIcon = vc.icon;

  return (
    <div className="rounded-xl border border-dark-border bg-dark-surface p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-dark-foreground">AI Verification</h3>
        {isRunning && (
          <span className="inline-flex items-center gap-1.5 text-xs text-primary-400">
            <Loader2 className="h-3 w-3 animate-spin" />
            Analyzing...
          </span>
        )}
      </div>

      {verification?.verdict && (
        <div className={`flex items-center gap-3 rounded-lg px-4 py-3 mb-4 ${vc.bg} border border-transparent`}>
          <VerdictIcon className={`h-5 w-5 ${vc.text}`} />
          <div>
            <p className={`text-sm font-semibold ${vc.text}`}>{vc.label}</p>
            {verification.confidence != null && (
              <p className="text-xs text-dark-muted">
                Confidence: {Math.round(verification.confidence * 100)}%
              </p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        {scoreItems.map((item) => {
          const score = getScore(item.key);
          const colors = scoreColors(score);
          const Icon = item.icon;

          return (
            <div key={item.key} className={`rounded-lg p-3 ${colors.bg} border border-transparent`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-3.5 w-3.5 ${colors.text}`} />
                <span className="text-[11px] font-medium text-dark-muted">{item.label}</span>
              </div>
              {score != null ? (
                <>
                  <p className={`text-lg font-bold ${colors.text}`}>{score}</p>
                  <div className="mt-1.5 h-1.5 rounded-full bg-dark-surface-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(score, 100)}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full rounded-full ${colors.bar}`}
                    />
                  </div>
                </>
              ) : (
                <p className="text-sm text-dark-muted">--</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="border-t border-dark-border pt-4">
        <h4 className="text-xs font-semibold text-dark-foreground mb-3 uppercase tracking-wider">
          Research Log
        </h4>
        <ResearchLogTimeline
          logs={verification?.research_logs || verification?.logs || []}
          isRunning={isRunning}
        />
      </div>
    </div>
  );
}
