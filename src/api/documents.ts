import client from './client';
import { Document, DocumentUploadResponse } from '../types';

export const documentsApi = {
  /**
   * Upload a document (resume, certificate, transcript)
   * @param file - The file to upload
   * @param type - Document type: 'resume' | 'certificate' | 'transcript'
   */
  upload: async (files: File[], type: 'resume' | 'certificate'): Promise<DocumentUploadResponse> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('type', type);

    try {
      const response = await client.post<DocumentUploadResponse>(
        '/api/v1/documents/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get all documents for the current user
   */
  getAll: async (): Promise<{ success: boolean; data: Document[] }> => {
    try {
      const response = await client.get('/api/v1/documents/my');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Submit a GitHub profile URL
   * @param githubUrl - The GitHub profile URL to submit
   */
  submitGithub: async (githubUrl: string): Promise<DocumentUploadResponse> => {
    try {
      const response = await client.post<DocumentUploadResponse>(
        '/api/v1/documents/github',
        { github_url: githubUrl }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Check analysis readiness for the current user
   */
  getReadiness: async (): Promise<{ success: boolean; data: { has_resume: boolean; has_certificate: boolean; has_github: boolean; is_ready: boolean; missing: string[] } }> => {
    try {
      const response = await client.get('/api/v1/documents/readiness');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Delete a specific document
   */
  delete: async (documentId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await client.delete(`/api/v1/documents/${documentId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Reprocess a document (trigger re-analysis)
   */
  reprocess: async (documentId: string): Promise<DocumentUploadResponse> => {
    try {
      const response = await client.post<DocumentUploadResponse>(
        `/api/v1/documents/${documentId}/reprocess`
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },
};
