import client from './client';
import { AnalysisResponse, TrustScore, LogEntry } from '../types';

export const analysisApi = {
  /**
   * Trigger analysis on user's uploaded documents
   * This will start the resume, certificate, and GitHub verification agents
   */
  start: async (): Promise<AnalysisResponse> => {
    try {
      const response = await client.post<any>(
        '/api/v1/analysis/start'
      );
      // Backend returns { job_id: '...', websocket_url: '...' }
      // Map it to AnalysisResponse format expected by frontend
      if (response.data && response.data.job_id) {
        return {
          success: true,
          message: 'Analysis started',
          data: {
            analysis_id: response.data.job_id,
            status: 'processing'
          }
        };
      }
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get current analysis status
   */
  getStatus: async (analysisId: string): Promise<AnalysisResponse> => {
    try {
      const response = await client.get<AnalysisResponse>(
        `/api/v1/analysis/${analysisId}/status`
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get the current trust score
   */
  getTrustScore: async (): Promise<{ success: boolean; data: TrustScore }> => {
    try {
      const response = await client.get('/api/v1/analysis/trust-score');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get WebSocket URL for live log streaming
   * Usage: const ws = new WebSocket(await analysisApi.getWebSocketUrl(analysisId))
   */
  getWebSocketUrl: async (analysisId: string): Promise<string> => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    const wsProtocol = baseUrl.startsWith('https') ? 'wss' : 'ws';
    const wsBase = baseUrl.replace(/^https?:/, '');
    
    // Get auth token
    const token = localStorage.getItem('auth_token');
    return `${wsProtocol}:${wsBase}/api/v1/analysis/${analysisId}/stream?token=${token}`;
  },

  /**
   * Get analysis logs (historical)
   */
  getLogs: async (analysisId: string): Promise<{ success: boolean; data: LogEntry[] }> => {
    try {
      const response = await client.get<{ success: boolean; data: LogEntry[] }>(
        `/api/v1/analysis/${analysisId}/logs`
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },
};
