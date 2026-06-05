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
  domain?: string;
  location?: string;
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
  document_id: string;
  user_id: string;
  type: 'resume' | 'certificate' | 'github';
  filename?: string;
  hash_sha256: string;
  status: 'pending' | 'analyzing' | 'done' | 'failed';
  uploaded_at: string;
  github_url?: string;
}

export interface DocumentUploadResponse {
  success: boolean;
  message: string;
  data: Document[];
}

// Analysis & Trust Score
export interface TrustScore {
  student_uid: string;
  trust_score: number;
  verdict: 'AUTHENTIC' | 'FLAGGED' | 'SUSPICIOUS' | 'FAKE' | 'verified' | 'likely_authentic' | 'suspicious' | 'flagged';
  resume_score: number;
  cert_score: number;
  github_score: number;
  flags: string[];
  created_at: string;
}

export interface LogEntry {
  type: 'thinking_token' | 'research_step_start' | 'research_step_complete' | 'analysis_complete' | 'error' | 'thinking';
  agent: 'resume' | 'cert' | 'github' | 'cross_reference';
  data?: any;
  token?: string;
  step?: string;
  result?: string;
  trust_score?: number;
  verdict?: string;
  timestamp: number;
}

export interface AnalysisStartResponse {
  job_id: string;
  websocket_url: string;
}

export interface AnalysisResponse {
  success: boolean;
  data: {
    verification: TrustScore;
    agent_results: any[];
  };
}

// Public Profile for Discovery
export interface PublicProfile {
  uid: string;
  display_name: string;
  domain: string;
  skills: string[];
  trust_score: number;
  verdict: string;
  is_public: boolean;
  location?: string;
  bio?: string;
  avatar_url?: string;
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
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
