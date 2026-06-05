import client from './client';
import { AnalysisResponse, TrustScore, LogEntry, AnalysisStartResponse } from '../types';
import { auth } from '../lib/firebase';

export const analysisApi = {
  /**
   * Start the multi-agent verification process
   */
  start: async (
    resume_document_id: string,
    cert_doc_ids: string[],
    github_url: string
  ): Promise<AnalysisStartResponse> => {
    try {
      const response = await client.post<AnalysisStartResponse>(
        '/api/v1/analysis/start',
        { resume_document_id, cert_doc_ids, github_url }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Fetch the latest verification result for a student
   */
  getResult: async (student_uid: string): Promise<AnalysisResponse> => {
    try {
      const response = await client.get<AnalysisResponse>(
        `/api/v1/analysis/result/${student_uid}`
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get student's own latest verification results
   */
  getMyResult: async (): Promise<AnalysisResponse> => {
    try {
      const response = await client.get<AnalysisResponse>('/api/v1/verification/my');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get student's verification results for recruiter if profile is public
   */
  getStudentResult: async (uid: string): Promise<AnalysisResponse> => {
    try {
      const response = await client.get<AnalysisResponse>(`/api/v1/verification/student/${uid}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get full research logs for a specific result
   */
  getLogs: async (resultId: string): Promise<{ success: boolean; data: any }> => {
    try {
      const response = await client.get(`/api/v1/verification/logs/${resultId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get WebSocket URL for live log streaming
   */
  getWebSocketUrl: async (jobId: string): Promise<string> => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated for WebSocket connection.');
    }
    const token = await user.getIdToken();

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    const wsProtocol = baseUrl.startsWith('https') ? 'wss' : 'ws';
    const wsBase = baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    return `${wsProtocol}://${wsBase}/api/v1/analysis/stream/${jobId}?token=${token}`;
  },
};
