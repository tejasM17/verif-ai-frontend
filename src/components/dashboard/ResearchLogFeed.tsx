import React, { useEffect, useRef } from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, Zap } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { LogEntry, AgentStatus } from '../../types';

interface ResearchLogFeedProps {
  logs: LogEntry[];
  agentStatuses: AgentStatus[];
  isConnected: boolean;
  isLoading: boolean;
  error?: string | null;
}

const getLogIcon = (type: LogEntry['type']) => {
  const iconMap: Record<LogEntry['type'], React.ComponentType<any>> = {
    info: Info,
    progress: Zap,
    warning: AlertTriangle,
    success: CheckCircle2,
    error: AlertCircle,
  };
  return iconMap[type] || Info;
};

const getLogColor = (
  type: LogEntry['type']
): { icon: string; text: string; bg: string } => {
  const colorMap: Record<
    LogEntry['type'],
    { icon: string; text: string; bg: string }
  > = {
    info: {
      icon: 'text-blue-400',
      text: 'text-blue-300',
      bg: 'bg-blue-500/5',
    },
    progress: {
      icon: 'text-amber-400',
      text: 'text-amber-300',
      bg: 'bg-amber-500/5',
    },
    warning: {
      icon: 'text-yellow-400',
      text: 'text-yellow-300',
      bg: 'bg-yellow-500/5',
    },
    success: {
      icon: 'text-emerald-400',
      text: 'text-emerald-300',
      bg: 'bg-emerald-500/5',
    },
    error: { icon: 'text-red-400', text: 'text-red-300', bg: 'bg-red-500/5' },
  };
  return colorMap[type] || colorMap.info;
};

export const ResearchLogFeed: React.FC<ResearchLogFeedProps> = ({
  logs,
  agentStatuses,
  isConnected,
  isLoading,
  error,
}) => {
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <Card bordered>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Research Log</h3>
          <div className="flex items-center gap-2">
            {isConnected && (
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
                <Badge variant="success" size="sm">
                  Live
                </Badge>
              </div>
            )}
            {isLoading && (
              <Badge variant="info" size="sm">
                Connecting...
              </Badge>
            )}
            {error && (
              <Badge variant="error" size="sm">
                {error}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardBody className="space-y-4">
        {/* Agent Status Overview */}
        <div className="grid grid-cols-3 gap-2">
          {agentStatuses.map((agent) => (
            <div
              key={agent.agent}
              className="p-3 rounded-lg bg-slate-700/30 border border-slate-600/30"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest capitalize">
                  {agent.agent}
                </p>
                {agent.status === 'completed' && (
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                )}
                {agent.status === 'processing' && (
                  <Zap className="h-3 w-3 text-amber-400 animate-pulse" />
                )}
                {agent.status === 'failed' && (
                  <AlertCircle className="h-3 w-3 text-red-400" />
                )}
              </div>
              {/* Progress Bar */}
              <div className="h-1.5 bg-slate-600/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${agent.progress}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-2">{agent.message}</p>
            </div>
          ))}
        </div>

        {/* Logs Container */}
        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {logs.length === 0 && !isLoading && (
            <div className="py-8 text-center">
              <p className="text-slate-400 text-sm">No logs yet. Upload documents to start analysis.</p>
            </div>
          )}

          {logs.map((log) => {
            const Icon = getLogIcon(log.type);
            const colors = getLogColor(log.type);

            return (
              <div
                key={log.id}
                className={`p-3 rounded-lg border border-slate-600/30 ${colors.bg}`}
              >
                <div className="flex gap-3">
                  <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${colors.icon}`} />
                  <div className="flex-grow">
                    <div className="flex items-start justify-between">
                      <p className={`text-sm ${colors.text}`}>{log.message}</p>
                      <span className="text-xs text-slate-400 flex-shrink-0 ml-2">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    {log.agent && (
                      <p className="text-xs text-slate-500 mt-1">
                        Agent: <span className="font-medium capitalize">{log.agent}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={logsEndRef} />
        </div>

        {isLoading && logs.length === 0 && (
          <div className="py-8 text-center">
            <div className="inline-flex items-center gap-2">
              <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" />
              <p className="text-slate-400 text-sm">Connecting to stream...</p>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

ResearchLogFeed.displayName = 'ResearchLogFeed';
