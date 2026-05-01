import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  role: "admin" | "user";
  name?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  expiresAt: number | null;
  setAuth: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      expiresAt: null,

      setAuth: (token) => {
        const expiry = Date.now() + 86400 * 1000; // 24 Hours
        set({ token, expiresAt: expiry });

        // Synchronize Cookie for Middleware/Server-side checks
        document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax; Secure`;
      },

      setUser: (user) => set({ user }),

      logout: () => {
        set({ token: null, user: null, expiresAt: null });
        // Wipe the Cookie
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        // Optional: clear local storage manually if needed
        localStorage.removeItem("auth-storage");
      },
    }),
    { name: "auth-storage" },
  ),
);
