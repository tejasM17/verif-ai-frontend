import client from './client';
import { AnalysisResponse, TrustScore, LogEntry, AnalysisStartResponse } from '../types';
import { auth } from '../lib/firebase'; // Import Firebase auth

export const analysisApi = {
  /**
   * Trigger analysis on user's uploaded documents
   * @param resume_document_id - The document_id of the uploaded resume
   * @param cert_doc_ids - An array of document_ids for uploaded certificates
   * @param github_url - The submitted GitHub profile URL
   */
  start: async (resume_document_id: string, cert_doc_ids: string[], github_url: string): Promise<{ success: boolean; data: AnalysisStartResponse }> => {
    try {
      const response = await client.post<{ success: boolean; data: AnalysisStartResponse }>(
        '/api/v1/analysis/start',
        { resume_document_id, cert_doc_ids, github_url }
      );
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
   * Usage: const ws = new WebSocket(await analysisApi.getWebSocketUrl(jobId))
   * @param jobId - The job_id returned from analysisApi.start
   */
  getWebSocketUrl: async (jobId: string): Promise<string> => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated for WebSocket connection.');
    }
    const token = await user.getIdToken();

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    // Replace http/https with ws/wss and remove trailing slash if any
    const wsProtocol = baseUrl.startsWith('https') ? 'wss' : 'ws';
    const wsBase = baseUrl.replace(/^https?:\/\//, ''); // Remove protocol part
    
    return `${wsProtocol}://${wsBase}/api/v1/analysis/stream/${jobId}?token=${token}`;
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
