import client from './client';
import { DiscoverResponse, PublicProfile } from '../types';

export interface SearchFilters {
  query?: string; // Search term (name, skills, etc.)
  minTrustScore?: number; // Minimum trust score (0-100)
  maxTrustScore?: number; // Maximum trust score (0-100)
  skills?: string[]; // Filter by skills
  page?: number; // Pagination page (default: 1)
  limit?: number; // Results per page (default: 20)
  sortBy?: 'trust_score' | 'recent' | 'relevance'; // Sort order
}

export const discoverApi = {
  /**
   * Search for public student profiles
   */
  search: async (filters: SearchFilters): Promise<DiscoverResponse> => {
    try {
      const params = new URLSearchParams();
      if (filters.query) params.append('query', filters.query);
      if (filters.minTrustScore !== undefined) params.append('min_trust_score', String(filters.minTrustScore));
      if (filters.maxTrustScore !== undefined) params.append('max_trust_score', String(filters.maxTrustScore));
      if (filters.skills?.length) params.append('skills', filters.skills.join(','));
      params.append('page', String(filters.page || 1));
      params.append('limit', String(filters.limit || 20));
      if (filters.sortBy) params.append('sort_by', filters.sortBy);

      const response = await client.get<DiscoverResponse>(
        `/api/v1/discover/search?${params.toString()}`
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get featured/recommended profiles
   */
  getFeatured: async (limit: number = 10): Promise<{ success: boolean; data: PublicProfile[] }> => {
    try {
      const response = await client.get('/api/v1/discover/featured', {
        params: { limit },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get list of all skills available for filtering
   */
  getSkillTags: async (): Promise<{ success: boolean; data: string[] }> => {
    try {
      const response = await client.get('/api/v1/discover/skills');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Add a student to recruiter's shortlist
   */
  shortlist: async (studentId: string, notes?: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await client.post('/api/v1/discover/shortlist', {
        student_id: studentId,
        notes,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Remove from shortlist
   */
  removeFromShortlist: async (studentId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await client.delete(`/api/v1/discover/shortlist/${studentId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get recruiter's shortlist
   */
  getShortlist: async (page: number = 1, limit: number = 20): Promise<DiscoverResponse> => {
    try {
      const response = await client.get<DiscoverResponse>('/api/v1/discover/shortlist', {
        params: { page, limit },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },
};
