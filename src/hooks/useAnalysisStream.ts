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
 * Updates in real-time as agents process documents
 */
export const useAnalysisStream = (analysisId: string | null): UseAnalysisStreamReturn => {
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
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  useEffect(() => {
    if (!analysisId) {
      setIsConnected(false);
      return;
    }

    const connectWebSocket = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const wsUrl = await analysisApi.getWebSocketUrl(analysisId);
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log('[WebSocket] Connected to analysis stream');
          setIsConnected(true);
          setIsLoading(false);
        };

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);

            // Handle different message types
            if (message.type === 'log') {
              const logEntry: LogEntry = {
                id: message.id || Date.now().toString(),
                timestamp: message.timestamp || new Date().toISOString(),
                type: message.level || 'info',
                message: message.message || message.text || '',
                agent: message.agent || 'resume',
              };
              setLogs((prev) => [...prev, logEntry]);
            } else if (message.type === 'agent_status') {
              const status: AgentStatus = {
                agent: message.agent,
                status: message.status,
                progress: message.progress || 0,
                message: message.message || '',
              };
              setAgentStatuses((prev) =>
                prev.map((s) => (s.agent === status.agent ? status : s))
              );
            } else if (message.type === 'complete') {
              console.log('[WebSocket] Analysis completed');
              setLogs((prev) => [
                ...prev,
                {
                  id: Date.now().toString(),
                  timestamp: new Date().toISOString(),
                  type: 'success',
                  message: '✅ Analysis complete!',
                  agent: 'resume',
                },
              ]);
            } else if (message.type === 'error') {
              console.error('[WebSocket] Error:', message.message);
              setError(message.message || 'An error occurred during analysis');
              setLogs((prev) => [
                ...prev,
                {
                  id: Date.now().toString(),
                  timestamp: new Date().toISOString(),
                  type: 'error',
                  message: `❌ ${message.message || 'Error occurred'}`,
                  agent: message.agent || 'resume',
                },
              ]);
            }
          } catch (err) {
            console.error('[WebSocket] Failed to parse message:', err);
          }
        };

        ws.onerror = (event) => {
          console.error('[WebSocket] Error:', event);
          setError('WebSocket connection error');
          setIsConnected(false);
        };

        ws.onclose = () => {
          console.log('[WebSocket] Disconnected');
          setIsConnected(false);

          // Attempt to reconnect after 3 seconds
          reconnectTimeoutRef.current = setTimeout(() => {
            if (analysisId) {
              connectWebSocket();
            }
          }, 3000);
        };

        wsRef.current = ws;
      } catch (err: any) {
        const errorMsg = err.message || 'Failed to connect to analysis stream';
        console.error('[WebSocket] Connection error:', errorMsg);
        setError(errorMsg);
        setIsLoading(false);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [analysisId]);

  return {
    logs,
    isConnected,
    isLoading,
    error,
    agentStatuses,
    clearLogs,
  };
};
