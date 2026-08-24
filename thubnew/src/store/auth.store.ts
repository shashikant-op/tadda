import { create } from "zustand";
import { User } from "@/types";
import { authService } from "@/services/auth.service";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
  let initialUser: User | null = null;
  let initialToken: string | null = null;

  if (typeof window !== "undefined") {
    initialToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        initialUser = JSON.parse(storedUser);
      } catch {
        initialUser = null;
      }
    }
  }

  return {
    user: initialUser,
    token: initialToken,
    isAuthenticated: !!initialToken,
    isLoading: false,
    login: (user, token) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      }
      set({ user, token, isAuthenticated: true, isLoading: false });
    },
    logout: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    },
    updateUser: (updatedData) =>
      set((state) => {
        const newUser = state.user ? { ...state.user, ...updatedData } : null;
        if (typeof window !== "undefined" && newUser) {
          localStorage.setItem("user", JSON.stringify(newUser));
        }
        return { user: newUser };
      }),
    initializeAuth: async () => {
      if (typeof window === "undefined") return;
      const token = localStorage.getItem("token");
      if (!token) {
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        return;
      }
      set({ isLoading: true });
      try {
        const user = await authService.getCurrentUser();
        localStorage.setItem("user", JSON.stringify(user));
        set({ user, token, isAuthenticated: true, isLoading: false });
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    },
  };
});

if (typeof window !== "undefined") {
  window.addEventListener("auth:unauthorized", () => useAuthStore.getState().logout());
}
