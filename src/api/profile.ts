import client from './client';
import { PublicProfile, User } from '../types';

export const profileApi = {
  /**
   * Get a public profile by user ID
   */
  getPublic: async (userId: string): Promise<{ success: boolean; data: PublicProfile }> => {
    try {
      const response = await client.get(`/api/v1/profile/${userId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get current user's profile
   */
  getMe: async (): Promise<{ success: boolean; data: User }> => {
    try {
      const response = await client.get('/api/v1/profile/me');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update user profile
   */
  update: async (data: Partial<User>): Promise<{ success: boolean; data: User }> => {
    try {
      const response = await client.put('/api/v1/profile/me', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Toggle profile visibility (public/private)
   */
  toggleVisibility: async (isPublic: boolean): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await client.patch('/api/v1/profile/visibility', {
        is_public: isPublic,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update user skills
   */
  updateSkills: async (skills: string[]): Promise<{ success: boolean; data: User }> => {
    try {
      const response = await client.put('/api/v1/profile/skills', { skills });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update user bio
   */
  updateBio: async (bio: string): Promise<{ success: boolean; data: User }> => {
    try {
      const response = await client.put('/api/v1/profile/bio', { bio });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },
};
