import axios from 'axios';
import { auth } from '../lib/firebase';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
});

client.interceptors.request.use(async (config) => {
  if (auth && auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
