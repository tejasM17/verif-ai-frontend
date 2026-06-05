export type Role = 'student' | 'recruiter';

export interface User {
  id: string;
  firebase_uid: string;
  email: string;
  role: Role;
  display_name?: string;
  created_at?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    idToken: string;
    refreshToken: string;
    expiresIn: string;
  };
}

export interface SyncResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface MeResponse {
  success: boolean;
  data: User;
}

export interface HealthResponse {
  success: boolean;
  data: {
    firebase: string;
    mongodb: string;
  };
}
