import apiClient from './client';
import { AuthResponse, SyncResponse, MeResponse, HealthResponse, Role, User } from '../types';

export const authApi = {
  // Direct Auth (if backend handles it)
  async register(data: { email: string; password: string; role: Role; display_name?: string }): Promise<AuthResponse> {
    const response = await apiClient.post('/api/v1/auth/register', data);
    return response.data;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const response = await apiClient.post('/api/v1/auth/login', data);
    return response.data;
  },

  // Sync with backend (after Firebase Auth on client)
  async sync(data: { firebase_uid: string; email: string; role: Role; display_name?: string }): Promise<SyncResponse> {
    const response = await apiClient.post('/api/v1/auth/sync', data);
    return response.data;
  },

  // Token Refresh
  async refresh(refreshToken: string): Promise<Pick<AuthResponse['data'], 'idToken' | 'refreshToken' | 'expiresIn'>> {
    const response = await apiClient.post('/api/v1/auth/refresh', { refresh_token: refreshToken });
    return response.data.data;
  },

  // Profile management
  async getMe(): Promise<MeResponse> {
    const response = await apiClient.get('/api/v1/auth/me');
    return response.data;
  },

  async updateRole(role: Role): Promise<SyncResponse> {
    const response = await apiClient.put('/api/v1/auth/role', { role });
    return response.data;
  },

  // Health check
  async getHealth(): Promise<HealthResponse> {
    const response = await apiClient.get('/api/v1/auth/health');
    return response.data;
  }
};
