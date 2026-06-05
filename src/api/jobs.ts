import client from './client';

export interface Job {
  id: string;
  title: string;
  company_name: string;
  location?: string;
  job_type: string;
  salary_range?: string;
  skills?: string[];
  description: string;
  created_at: string;
  is_active: boolean;
  recruiter_id: string;
}

export const jobsApi = {
  /**
   * Get all available jobs for students
   */
  getJobs: async (): Promise<{ success: boolean; data: Job[] }> => {
    try {
      const response = await client.get('/api/v1/jobs');
      return response.data;
    } catch (error: any) {
      // Return empty array for now since backend may not have this endpoint
      return { success: true, data: [] };
    }
  },

  /**
   * Apply for a job
   */
  applyForJob: async (jobId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await client.post(`/api/v1/jobs/${jobId}/apply`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get my applications (student)
   */
  getMyApplications: async (): Promise<{ success: boolean; data: any[] }> => {
    try {
      const response = await client.get('/api/v1/applications/my');
      return response.data;
    } catch (error: any) {
      return { success: true, data: [] };
    }
  },
};