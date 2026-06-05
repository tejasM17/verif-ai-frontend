import client from './client';
import { DiscoverResponse, PublicProfile } from '../types';

export interface SearchFilters {
  skills?: string[];
  min_trust?: number;
  domain?: string;
  location?: string;
  limit?: number;
  offset?: number;
}

export const discoverApi = {
  /**
   * List all public profiles paginated
   */
  list: async (limit: number = 20, offset: number = 0): Promise<DiscoverResponse> => {
    try {
      const response = await client.get<DiscoverResponse>('/api/v1/discover', {
        params: { limit, offset },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Search public profiles with filters
   */
  search: async (filters: SearchFilters): Promise<DiscoverResponse> => {
    try {
      const params = new URLSearchParams();
      if (filters.skills?.length) params.append('skills', filters.skills.join(','));
      if (filters.min_trust !== undefined) params.append('min_trust', String(filters.min_trust));
      if (filters.domain) params.append('domain', filters.domain);
      if (filters.location) params.append('location', filters.location);
      params.append('limit', String(filters.limit || 20));
      params.append('offset', String(filters.offset || 0));

      const response = await client.get<DiscoverResponse>(
        `/api/v1/discover/search?${params.toString()}`
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Add student to recruiter's shortlist
   */
  shortlist: async (uid: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await client.post(`/api/v1/discover/shortlist/${uid}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get all shortlisted profiles for the recruiter
   */
  getShortlist: async (): Promise<{ success: boolean; data: PublicProfile[] }> => {
    try {
      const response = await client.get('/api/v1/discover/shortlist');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },
};
