import { create } from "zustand";
import { authApi, ApiError, setToken, getToken, type AuthUser } from "./api";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  init: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  init: async () => {
    const token = getToken();
    if (!token) {
      set({ isLoading: false });
      return;
    }
    try {
      const { user } = await authApi.me();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      setToken(null);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await authApi.register(name, email, password);
      setToken(token);
      set({ user, isAuthenticated: true, isLoading: false });
      return true;
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Registration failed";
      set({ isLoading: false, error: message });
      return false;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await authApi.login(email, password);
      setToken(token);
      set({ user, isAuthenticated: true, isLoading: false });
      return true;
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Login failed";
      set({ isLoading: false, error: message });
      return false;
    }
  },

  logout: () => {
    setToken(null);
    set({ user: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null }),
}));
