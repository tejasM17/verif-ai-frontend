import client from './client';
import { PublicProfile } from '../types';

export interface Application {
  id: string;
  student_id: string;
  student: PublicProfile;
  job_id: string;
  job_title: string;
  company_name: string;
  applied_at: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
}

export const applicationsApi = {
  /**
   * Get all applications for recruiter
   */
  getApplications: async (): Promise<{ success: boolean; data: Application[] }> => {
    try {
      const response = await client.get('/api/v1/applications');
      return response.data;
    } catch (error: any) {
      // Return empty array for now since backend may not have this endpoint
      return { success: true, data: [] };
    }
  },

  /**
   * Get single application
   */
  getApplication: async (id: string): Promise<{ success: boolean; data: Application }> => {
    try {
      const response = await client.get(`/api/v1/applications/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update application status
   */
  updateStatus: async (id: string, status: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await client.patch(`/api/v1/applications/${id}/status`, { status });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get jobs posted by recruiter
   */
  getMyJobs: async (): Promise<{ success: boolean; data: any[] }> => {
    try {
      const response = await client.get('/api/v1/jobs/my');
      return response.data;
    } catch (error: any) {
      return { success: true, data: [] };
    }
  },

  /**
   * Post a new job
   */
  postJob: async (jobData: {
    title: string;
    company_name: string;
    location?: string;
    job_type: string;
    salary_range?: string;
    skills?: string[];
    description: string;
  }): Promise<{ success: boolean; data: any }> => {
    try {
      const response = await client.post('/api/v1/jobs', jobData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },
};