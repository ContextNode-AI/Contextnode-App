// ContextNode Client API Service
// Connects Next.js Frontend (Port 3000) to NestJS Backend (Port 3001)

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "CREATOR" | "ADMIN" | "USER";
  status: "ACTIVE" | "SUSPENDED" | "DISABLED";
  plan: "FREE" | "PAID";
  avatar?: string | null;
  bio?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface ApiErrorResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
}

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export class ApiError extends Error {
  statusCode: number;
  details?: string | string[];

  constructor(message: string, statusCode = 400, details?: string | string[]) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  // Get token from localStorage if available
  let token: string | null = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("contextnode_token");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // Send & receive HTTP-only cookies
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      let errorMessage = "An unexpected error occurred";
      if (data) {
        if (Array.isArray(data.message)) {
          errorMessage = data.message.join(", ");
        } else if (typeof data.message === "string") {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = data.error;
        }
      } else {
        errorMessage = `HTTP error ${response.status}: ${response.statusText}`;
      }

      throw new ApiError(errorMessage, response.status, data?.message);
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network error / connection refused
    throw new ApiError(
      "Unable to connect to ContextNode API server. Please ensure the backend is running.",
      503
    );
  }
}

export const api = {
  auth: {
    // Register new Creator account
    async register(data: {
      name: string;
      email: string;
      password: string;
    }): Promise<AuthResponse> {
      return request<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    // Login with Email & Password
    async login(data: {
      email: string;
      password: string;
    }): Promise<AuthResponse> {
      return request<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    // Get current authenticated user profile
    async me(overrideToken?: string): Promise<AuthUser> {
      const headers: Record<string, string> = {};
      if (overrideToken) {
        headers["Authorization"] = `Bearer ${overrideToken}`;
      }
      return request<AuthUser>("/auth/me", {
        method: "GET",
        headers,
      });
    },

    // Refresh access token
    async refresh(refreshToken?: string): Promise<AuthResponse> {
      return request<AuthResponse>("/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      });
    },

    // Logout and invalidate session
    async logout(): Promise<{ success: boolean; message: string }> {
      try {
        return await request<{ success: boolean; message: string }>(
          "/auth/logout",
          {
            method: "POST",
          }
        );
      } catch {
        return { success: true, message: "Logged out locally" };
      }
    },
  },
};
