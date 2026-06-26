import axios from "axios";
import { getToken } from "../utils/token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signup = (email, password, role) =>
  api.post("/signup", { email, password, role });

export const login = (email, password) =>
  api.post("/login", { email, password });

export const googleLogin = (idToken) =>
  api.post("/google", { id_token: idToken });

export const githubLogin = (idToken) =>
  api.post("/github", { id_token: idToken });

export const getMe = () => api.get("/me");

export const getProfile = () => api.get("/profile/me");

export const updateProfile = (data) => api.put("/profile/me", data);

export const deleteProfile = () => api.delete("/profile/me");

export const updateRole = (role) => api.put("/profile/role", { role });

export const uploadPhoto = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.put("/profile/photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getPhotoUrl = (photoUrl) => {
  if (!photoUrl) return null;
  if (photoUrl.startsWith("http")) return photoUrl;
  return `${API_BASE}${photoUrl}`;
};

export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/resume/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getResumeInfo = () => api.get("/resume/me");

export const getResumeDownloadUrl = (uid) => `${API_BASE}/resume/file/${uid}`;

export const deleteResume = () => api.delete("/resume/me");

export const searchCompanies = ({ q = "", location = "", role = "", limit = 20, skip = 0 } = {}) =>
  api.get("/companies/search", {
    params: { q: q || undefined, location: location || undefined, role: role || undefined, limit, skip },
  });

export const listCompanies = ({ limit = 20, skip = 0 } = {}) =>
  api.get("/companies", { params: { limit, skip } });

export const getCompany = (uid) => api.get(`/companies/${uid}`);

export const getCompanyLogoUrl = (uid) => `${API_BASE}/profile/photo/${uid}`;

// Recruiter-facing company endpoints
export const getMyCompany = () => api.get("/companies/me");
export const upsertMyCompany = (data) => api.post("/companies/me", data);
export const updateMyCompany = (data) => api.put("/companies/me", data);

// Recruiter-facing applications endpoints
export const recruiterApplications = ({ status, limit = 20, skip = 0 } = {}) =>
  api.get("/applications/recruiter/me", {
    params: { status: status || undefined, limit, skip },
  });

export const updateApplicationStatus = (appId, status, note) =>
  api.patch(`/applications/${appId}/status`, { status, note });

// Companies (jobs) — listing jobs for a company
export const listCompanyJobs = (companyUid, { status = "open", limit = 50, skip = 0 } = {}) =>
  api.get(`/companies/${companyUid}/jobs`, { params: { status, limit, skip } });

export const getJob = (uid) => api.get(`/jobs/${uid}`);

// Recruiter — manage their jobs
export const createMyJob = (data) => api.post("/companies/me/jobs", data);

export const listMyJobs = ({ status, limit = 50, skip = 0 } = {}) =>
  api.get("/companies/me/jobs", { params: { status: status || undefined, limit, skip } });

export const updateJob = (uid, data) => api.patch(`/jobs/${uid}`, data);

export const deleteJob = (uid) => api.delete(`/jobs/${uid}`);

// Student-facing applications
export const submitApplication = (data) => api.post("/applications/submit", data);

export const deleteApplication = (appId) => api.delete(`/applications/${appId}`);

export const getApplication = (appId) => api.get(`/applications/${appId}`);

export const myApplications = ({ status, limit = 50, skip = 0 } = {}) =>
  api.get("/applications/me", { params: { status: status || undefined, limit, skip } });
