import React, { useEffect, useRef } from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, Zap, Bot, Search, Database } from 'lucide-react';
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

const getAgentIcon = (agent: LogEntry['agent']) => {
  switch (agent) {
    case 'resume': return Bot;
    case 'cert': return AwardIcon; // Need to import or use a fallback
    case 'github': return GithubIcon;
    case 'cross_reference': return ShieldIcon;
    default: return Search;
  }
};

// Use Lucide icons directly
const AwardIcon = Award;
import { Award, Github, Shield } from 'lucide-react';

const getLogColor = (
  type: LogEntry['type']
): { icon: string; text: string; bg: string; border: string } => {
  switch (type) {
    case 'thinking':
    case 'thinking_token':
      return { icon: 'text-indigo-400', text: 'text-slate-300', bg: 'bg-indigo-500/5', border: 'border-indigo-500/20' };
    case 'research_step_start':
      return { icon: 'text-blue-400', text: 'text-blue-200', bg: 'bg-blue-500/5', border: 'border-blue-500/20' };
    case 'research_step_complete':
      return { icon: 'text-emerald-400', text: 'text-emerald-200', bg: 'bg-emerald-500/5', border: 'border-emerald-500/20' };
    case 'analysis_complete':
      return { icon: 'text-purple-400', text: 'text-purple-200', bg: 'bg-purple-500/5', border: 'border-purple-500/20' };
    case 'error':
      return { icon: 'text-red-400', text: 'text-red-200', bg: 'bg-red-500/5', border: 'border-red-500/20' };
    default:
      return { icon: 'text-slate-400', text: 'text-slate-300', bg: 'bg-slate-500/5', border: 'border-slate-500/20' };
  }
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

  const renderLogContent = (log: LogEntry) => {
    if (log.type === 'thinking' || log.type === 'thinking_token') {
      return (
        <div className="font-mono text-xs opacity-80 leading-relaxed italic">
          {log.token || 'Analyzing pattern...'}
          <span className="inline-block w-1.5 h-3 bg-indigo-400 ml-0.5 animate-pulse" />
        </div>
      );
    }
    if (log.type === 'research_step_start') {
      return <span className="font-semibold">{log.step}</span>;
    }
    if (log.type === 'research_step_complete') {
      return (
        <div className="space-y-1">
          <span className="font-semibold">{log.step}</span>
          <div className="text-xs opacity-70 p-2 bg-black/20 rounded border border-white/5 mt-1">
            {log.result}
          </div>
        </div>
      );
    }
    if (log.type === 'analysis_complete') {
      return (
        <div className="flex items-center gap-3 py-1">
          <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <p className="font-bold text-purple-300">Analysis Complete</p>
            <p className="text-xs opacity-70">Final Score: {log.trust_score}% | Verdict: {log.verdict?.toUpperCase()}</p>
          </div>
        </div>
      );
    }
    return <span>{log.message || log.result}</span>;
  };

  return (
    <Card bordered className="bg-slate-900 border-slate-800 shadow-2xl">
      <CardHeader className="border-b border-slate-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-500/10 rounded-lg">
              <Database className="h-4 w-4 text-indigo-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Live Research Log</h3>
          </div>
          <div className="flex items-center gap-2">
            {isConnected && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tight">Stream Live</span>
              </div>
            )}
            {isLoading && (
              <Badge variant="info" size="sm" className="animate-pulse">Connecting...</Badge>
            )}
            {error && (
              <Badge variant="error" size="sm">{error}</Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardBody className="p-0">
        {/* Agent Trackers */}
        <div className="grid grid-cols-3 gap-px bg-slate-800/50 border-b border-slate-800">
          {agentStatuses.map((agent) => (
            <div key={agent.agent} className="p-4 bg-slate-900/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{agent.agent}</span>
                {agent.status === 'completed' ? (
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                ) : agent.status === 'processing' ? (
                  <div className="h-3 w-3 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
                ) : (
                  <div className="h-3 w-3 rounded-full bg-slate-800" />
                )}
              </div>
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${agent.status === 'completed' ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                  style={{ width: `${agent.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Terminal Feed */}
        <div className="h-[450px] overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {logs.length === 0 && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center opacity-30 grayscale italic">
              <Search className="h-8 w-8 mb-2" />
              <p className="text-xs">Awaiting agent activation...</p>
            </div>
          )}

          {logs.map((log, i) => {
            const colors = getLogColor(log.type);
            return (
              <div
                key={i}
                className={`group p-3 rounded-xl border ${colors.border} ${colors.bg} transition-all hover:bg-white/5 animate-fade-in`}
              >
                <div className="flex gap-3">
                  <div className={`mt-0.5 p-1 rounded-md bg-black/20 ${colors.icon}`}>
                    <Search className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity">
                        Agent: {log.agent}
                      </span>
                      <span className="text-[9px] font-mono opacity-30 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                    <div className={`text-sm leading-relaxed ${colors.text}`}>
                      {renderLogContent(log)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={logsEndRef} />
        </div>
      </CardBody>
    </Card>
  );
};
