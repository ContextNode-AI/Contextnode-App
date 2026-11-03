"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { api, AuthUser, ApiError } from "@/lib/api";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isCreator: boolean;
  isAdmin: boolean;
  login: (credentials: { email: string; password: string }) => Promise<AuthUser>;
  register: (data: { name: string; email: string; password: string }) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "contextnode_token";
const USER_KEY = "contextnode_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync state from client storage on mount and verify with /api/auth/me
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        let activeToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        // Check if returning from Google OAuth redirect (?token=...&oauth=google)
        if (typeof window !== "undefined") {
          const urlParams = new URLSearchParams(window.location.search);
          const urlToken = urlParams.get("token");
          if (urlToken) {
            activeToken = urlToken;
            localStorage.setItem(TOKEN_KEY, urlToken);
            // Clean up query param from URL without reloading
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
          }
        }

        if (activeToken) {
          setToken(activeToken);
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch {
              // Ignore parse error
            }
          }

          // Verify with live backend session
          try {
            const liveUser = await api.auth.me(activeToken);
            if (mounted) {
              setUser(liveUser);
              localStorage.setItem(USER_KEY, JSON.stringify(liveUser));
            }
          } catch (err) {
            if (err instanceof ApiError && err.statusCode === 401) {
              // Token expired or invalid
              localStorage.removeItem(TOKEN_KEY);
              localStorage.removeItem(USER_KEY);
              if (mounted) {
                setToken(null);
                setUser(null);
              }
            }
          }
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      setIsLoading(true);
      try {
        const res = await api.auth.login(credentials);
        setToken(res.accessToken);
        setUser(res.user);
        localStorage.setItem(TOKEN_KEY, res.accessToken);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        return res.user;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const register = useCallback(
    async (data: { name: string; email: string; password: string }) => {
      setIsLoading(true);
      try {
        const res = await api.auth.register(data);
        setToken(res.accessToken);
        setUser(res.user);
        localStorage.setItem(TOKEN_KEY, res.accessToken);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        return res.user;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await api.auth.logout();
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setToken(null);
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const liveUser = await api.auth.me();
      setUser(liveUser);
      localStorage.setItem(USER_KEY, JSON.stringify(liveUser));
      return liveUser;
    } catch {
      return null;
    }
  }, []);

  const isAuthenticated = !!user && !!token;
  const isCreator = user?.role === "CREATOR" || user?.role === "ADMIN";
  const isAdmin = user?.role === "ADMIN";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        isCreator,
        isAdmin,
        login,
        register,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

