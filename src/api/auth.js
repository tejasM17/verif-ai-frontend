import axios from "axios";
import { getToken } from "../utils/token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signup = (email, password) =>
  api.post("/signup", { email, password });

export const login = (email, password) =>
  api.post("/login", { email, password });

export const getMe = () => api.get("/me");
