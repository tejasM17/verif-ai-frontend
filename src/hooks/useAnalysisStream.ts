import { useEffect, useState, useCallback, useRef } from 'react';
import { LogEntry, AgentStatus } from '../types';
import { analysisApi } from '../api/analysis';

interface UseAnalysisStreamReturn {
  logs: LogEntry[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  agentStatuses: AgentStatus[];
  clearLogs: () => void;
}

/**
 * Hook for connecting to WebSocket stream of analysis logs
 */
export const useAnalysisStream = (websocketUrl: string | null): UseAnalysisStreamReturn => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agentStatuses, setAgentStatuses] = useState<AgentStatus[]>([
    { agent: 'resume', status: 'pending', progress: 0, message: 'Waiting to start...' },
    { agent: 'certificate', status: 'pending', progress: 0, message: 'Waiting to start...' },
    { agent: 'github', status: 'pending', progress: 0, message: 'Waiting to start...' },
  ]);
  const wsRef = useRef<WebSocket | null>(null);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  useEffect(() => {
    if (!websocketUrl) {
      setIsConnected(false);
      return;
    }

    const connect = () => {
      setIsLoading(true);
      setError(null);

      const ws = new WebSocket(websocketUrl);

      ws.onopen = () => {
        console.log('[WebSocket] Connected');
        setIsConnected(true);
        setIsLoading(false);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          const { type, data } = message;

          // Aligning with CONTRACT.md
          if (type === 'thinking_token' || type === 'thinking') {
            // Incremental token updates (Grok-style)
            setLogs((prev) => {
              const lastLog = prev[prev.length - 1];
              if (lastLog && lastLog.type === 'thinking' && lastLog.agent === data.agent) {
                return [
                  ...prev.slice(0, -1),
                  { ...lastLog, token: (lastLog.token || '') + (data.token || '') }
                ];
              }
              return [
                ...prev,
                {
                  type: 'thinking',
                  agent: data.agent,
                  token: data.token,
                  timestamp: Date.now(),
                } as LogEntry
              ];
            });
          } else if (type === 'research_step_start') {
            setLogs((prev) => [...prev, {
              type: 'research_step_start',
              agent: data.agent,
              step: data.step,
              timestamp: Date.now(),
            } as LogEntry]);
            
            setAgentStatuses(prev => prev.map(s => 
              s.agent === data.agent ? { ...s, status: 'processing', message: data.step } : s
            ));
          } else if (type === 'research_step_complete') {
            setLogs((prev) => [...prev, {
              type: 'research_step_complete',
              agent: data.agent,
              step: data.step,
              result: data.result,
              timestamp: Date.now(),
            } as LogEntry]);
            
            setAgentStatuses(prev => prev.map(s => 
              s.agent === data.agent ? { ...s, progress: (s.progress || 0) + 33, message: `Completed: ${data.step}` } : s
            ));
          } else if (type === 'analysis_complete') {
            setLogs((prev) => [...prev, {
              type: 'analysis_complete',
              agent: 'cross_reference',
              trust_score: data.trust_score,
              verdict: data.verdict,
              timestamp: Date.now(),
            } as LogEntry]);
            
            setAgentStatuses(prev => prev.map(s => ({ ...s, status: 'completed', progress: 100 })));
          } else if (type === 'error') {
            setError(data.message || 'Analysis error');
            setLogs((prev) => [...prev, {
              type: 'error',
              agent: data.agent || 'cross_reference',
              result: data.message,
              timestamp: Date.now(),
            } as LogEntry]);
          }
        } catch (err) {
          console.error('[WebSocket] Parse error:', err);
        }
      };

      ws.onerror = (err) => {
        console.error('[WebSocket] Error:', err);
        setError('Connection failed');
        setIsConnected(false);
        setIsLoading(false);
      };

      ws.onclose = () => {
        console.log('[WebSocket] Closed');
        setIsConnected(false);
      };

      wsRef.current = ws;
    };

    connect();

    return () => {
      wsRef.current?.close();
    };
  }, [websocketUrl]);

  return { logs, isConnected, isLoading, error, agentStatuses, clearLogs };
};
