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
