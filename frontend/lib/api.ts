import { useAuthStore } from "@/store/authStore";
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

// Interceptor to add token to every request automatically
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token; // Get token directly from Zustand
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
