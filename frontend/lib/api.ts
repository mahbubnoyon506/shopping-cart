import axios from "axios";
import { useAuthStore } from "@/store/authStore";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

// REQUEST Interceptor: Attach token and check client-side expiry
api.interceptors.request.use(
  (config) => {
    const { token, expiresAt, logout } = useAuthStore.getState();

    // 1. Client-side Expiry Check
    if (expiresAt && Date.now() > expiresAt) {
      logout();
      if (typeof window !== "undefined") window.location.href = "/login";
      return Promise.reject(new Error("Token expired locally"));
    }

    // 2. Attach Token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// RESPONSE Interceptor: Handle Server-side 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If server says unauthorized (expired or invalid)
    if (error.response?.status === 401) {
      const { logout } = useAuthStore.getState();
      logout();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
