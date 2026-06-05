export type Role = 'student' | 'recruiter';

export interface User {
  id: string;
  firebase_uid: string;
  email: string;
  role: Role;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  skills?: string[];
  linkedin_url?: string;
  portfolio_url?: string;
  created_at?: string;
  updated_at?: string;
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

// Document types
export interface Document {
  document_id: string; // Renamed from 'id' to match backend
  user_id: string; // Added to match backend
  type: 'resume' | 'certificate' | 'github'; // Added 'github' type
  file_name: string; // Renamed from 'file_name' to match backend
  hash_sha256: string; // Added to match backend
  status: 'pending' | 'processed' | 'analyzing' | 'done' | 'failed'; // Added 'analyzing', 'done'
  uploaded_at: string; // Added to match backend
  github_url?: string; // Added for github document type
}

export interface DocumentUploadResponse {
  success: boolean;
  message: string;
  data: Document[]; // Changed to array of Document
}

// Analysis & Trust Score
export interface TrustScore {
  score: number; // 0-100
  level: 'low' | 'medium' | 'high' | 'excellent';
  last_updated: string;
  breakdown: {
    resume_verification: number;
    certificate_verification: number;
    github_validation: number;
  };
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'progress' | 'warning' | 'success' | 'error';
  message: string;
  agent: 'resume' | 'certificate' | 'github';
}

export interface AnalysisStartResponse {
  job_id: string;
  websocket_url: string;
}

export interface AnalysisResponse {
  success: boolean;
  message: string;
  data: {
    analysis_id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    trust_score?: TrustScore;
  };
}

export interface AgentStatus {
  agent: 'resume' | 'certificate' | 'github';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  message: string;
}

// Public Profile for Discovery
export interface PublicProfile {
  id: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  skills: string[];
  trust_score: TrustScore;
  is_public: boolean;
  linkedin_url?: string;
  portfolio_url?: string;
  github_url?: string;
  created_at: string;
}

export interface DiscoverResponse {
  success: boolean;
  data: {
    students: PublicProfile[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface ShortlistEntry {
  recruiter_id: string;
  student_id: string;
  added_at: string;
  notes?: string;
}
