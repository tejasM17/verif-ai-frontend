import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  FileText,
  GitBranch,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ExternalLink,
  Zap,
} from 'lucide-react';

const logTypeConfig = {
  resume_scan: { icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  certificate_verify: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  github_analysis: { icon: GitBranch, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  cross_reference: { icon: Search, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  verdict: { icon: Zap, color: 'text-primary-400', bg: 'bg-primary-500/10', border: 'border-primary-500/20' },
  error: { icon: AlertCircle, color: 'text-error', bg: 'bg-error/10', border: 'border-error/20' },
};

function getLogConfig(type) {
  return logTypeConfig[type] || logTypeConfig.cross_reference;
}

export default function ResearchLogTimeline({ logs = [], isRunning = false }) {
  if (!logs.length && !isRunning) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Search className="h-8 w-8 text-dark-muted mb-3" />
        <p className="text-sm text-dark-muted">No research logs available</p>
        <p className="text-xs text-dark-muted mt-1">Verification results will appear here</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-[17px] top-0 bottom-0 w-px bg-dark-border" />

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {logs.map((log, index) => {
            const config = getLogConfig(log.type);
            const Icon = config.icon;
            const isLatest = index === logs.length - 1;

            return (
              <motion.div
                key={log.id || index}
                initial={{ opacity: 0, x: -12, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="relative pl-10"
              >
                <div
                  className={`absolute left-[10px] top-[2px] flex h-[15px] w-[15px] items-center justify-center rounded-full border-2 ${
                    isLatest && isRunning
                      ? 'border-primary-500 bg-dark-surface'
                      : log.status === 'completed'
                        ? 'border-emerald-500 bg-emerald-500/20'
                        : log.status === 'error'
                          ? 'border-error bg-error/20'
                          : 'border-dark-border bg-dark-surface'
                  }`}
                >
                  {isLatest && isRunning ? (
                    <Loader2 className="h-3 w-3 text-primary-400 animate-spin" />
                  ) : (
                    <div
                      className={`h-[5px] w-[5px] rounded-full ${
                        log.status === 'completed'
                          ? 'bg-emerald-400'
                          : log.status === 'error'
                            ? 'bg-error'
                            : 'bg-dark-muted'
                      }`}
                    />
                  )}
                </div>

                <div
                  className={`rounded-lg border p-3 transition-colors ${
                    isLatest && isRunning
                      ? 'border-primary-500/30 bg-primary-500/5'
                      : log.status === 'error'
                        ? 'border-error/20 bg-error/5'
                        : config.bg + ' ' + config.border
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${config.color}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm font-medium ${config.color}`}>
                          {log.title || log.type?.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                        </p>
                        {log.timestamp && (
                          <span className="text-[10px] text-dark-muted whitespace-nowrap flex-shrink-0">
                            {log.timestamp}
                          </span>
                        )}
                      </div>

                      {log.description && (
                        <p className="text-xs text-dark-muted mt-1 leading-relaxed">
                          {log.description}
                        </p>
                      )}

                      {log.evidence && (
                        <div className="mt-2 rounded-md bg-dark-surface-muted/50 border border-dark-border/50 px-3 py-2">
                          <p className="text-[11px] text-dark-muted font-mono leading-relaxed whitespace-pre-wrap">
                            {log.evidence}
                          </p>
                        </div>
                      )}

                      {log.sourceLinks && log.sourceLinks.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {log.sourceLinks.map((link, li) => (
                            <a
                              key={li}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-primary-400 hover:text-primary-300 transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                              {link.label || link.url}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
