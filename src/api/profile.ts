import client from './client';
import { PublicProfile, User } from '../types';

export const profileApi = {
  /**
   * Update student profile details and optionally publish it
   */
  update: async (data: {
    skills?: string[];
    domain?: string;
    location?: string;
    bio?: string;
    is_public?: boolean;
    linkedin_url?: string;
    portfolio_url?: string;
  }): Promise<{ success: boolean; data: PublicProfile }> => {
    try {
      const response = await client.put('/api/v1/profile/update', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Make student profile public
   */
  publish: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await client.post('/api/v1/profile/publish');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Make student profile private
   */
  unpublish: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await client.post('/api/v1/profile/unpublish');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get a public profile by UID
   */
  getPublic: async (uid: string): Promise<PublicProfile> => {
    try {
      const response = await client.get(`/api/v1/profile/${uid}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get current user's profile from auth service
   */
  getMe: async (): Promise<{ success: boolean; data: User }> => {
    try {
      const response = await client.get('/api/v1/auth/me');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },
};
