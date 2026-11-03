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
  googleId?: string | null;
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

  users: {
    async getMyProfile(): Promise<AuthUser> {
      return request<AuthUser>("/users/profile/me", {
        method: "GET",
      });
    },

    async updateMyProfile(data: {
      name?: string;
      bio?: string;
      avatar?: string;
    }): Promise<AuthUser> {
      return request<AuthUser>("/users/profile/me", {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
  },

  prompts: {
    async createCreativeImage(data: CreateImagePromptPayload): Promise<ImagePrompt> {
      return request<ImagePrompt>("/prompts/creative/image", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    async getMyImagePrompts(): Promise<ImagePrompt[]> {
      return request<ImagePrompt[]>("/prompts/creative/image/my", {
        method: "GET",
      });
    },

    async getMyImagePromptById(id: string): Promise<ImagePrompt> {
      return request<ImagePrompt>(`/prompts/creative/image/my/${id}`, {
        method: "GET",
      });
    },

    async updateImagePrompt(id: string, data: Partial<CreateImagePromptPayload>): Promise<ImagePrompt> {
      return request<ImagePrompt>(`/prompts/creative/image/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },

    async submitForReview(id: string): Promise<ImagePrompt> {
      return request<ImagePrompt>(`/prompts/creative/image/${id}/submit-review`, {
        method: "POST",
      });
    },

    async deleteImagePrompt(id: string): Promise<{ success: boolean; message: string }> {
      return request<{ success: boolean; message: string }>(`/prompts/creative/image/${id}`, {
        method: "DELETE",
      });
    },

    async getPublicPrompts(params?: { category?: string; tool?: string; search?: string }): Promise<ImagePrompt[]> {
      const query = new URLSearchParams();
      if (params?.category) query.append("category", params.category);
      if (params?.tool) query.append("tool", params.tool);
      if (params?.search) query.append("search", params.search);
      const qs = query.toString();
      return request<ImagePrompt[]>(`/prompts/creative/image${qs ? `?${qs}` : ""}`, {
        method: "GET",
      });
    },

    async getPublicPromptBySlug(slug: string): Promise<ImagePrompt> {
      return request<ImagePrompt>(`/prompts/creative/image/${slug}`, {
        method: "GET",
      });
    },
  },

  admin: {
    async getOverview(): Promise<{
      metrics: {
        totalUsers: number;
        totalCreators: number;
        totalAdmins: number;
        totalPrompts: number;
        pendingPrompts: number;
        publishedPrompts: number;
        totalViews: number;
      };
      recentPending: ImagePrompt[];
      recentUsers: AuthUser[];
    }> {
      return request("/admin/overview", {
        method: "GET",
      });
    },

    async getUsers(params?: {
      role?: string;
      status?: string;
      search?: string;
    }): Promise<
      (AuthUser & {
        promptsCount: number;
        contextPacksCount: number;
      })[]
    > {
      const query = new URLSearchParams();
      if (params?.role) query.append("role", params.role);
      if (params?.status) query.append("status", params.status);
      if (params?.search) query.append("search", params.search);
      const qs = query.toString();
      return request(`/admin/users${qs ? `?${qs}` : ""}`, {
        method: "GET",
      });
    },

    async getUserById(id: string): Promise<
      AuthUser & {
        promptsCount: number;
        prompts: ImagePrompt[];
      }
    > {
      return request(`/admin/users/${id}`, {
        method: "GET",
      });
    },

    async updateUserStatus(
      id: string,
      status: "ACTIVE" | "SUSPENDED" | "DISABLED"
    ): Promise<AuthUser> {
      return request(`/admin/users/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
    },

    async createStaffUser(data: {
      name: string;
      email: string;
      password: string;
      role?: "ADMIN";
    }): Promise<AuthUser> {
      return request("/admin/users/create-staff", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    async getPendingPrompts(): Promise<ImagePrompt[]> {
      return request<ImagePrompt[]>("/admin/prompts/pending-review", {
        method: "GET",
      });
    },

    async reviewPrompt(id: string, action: "APPROVE" | "REJECT", feedback?: string): Promise<ImagePrompt> {
      return request<ImagePrompt>(`/admin/prompts/${id}/review`, {
        method: "PATCH",
        body: JSON.stringify({ action, feedback }),
      });
    },

    async toggleFeatured(id: string, featured?: boolean): Promise<ImagePrompt> {
      return request<ImagePrompt>(`/admin/prompts/${id}/featured`, {
        method: "PATCH",
        body: JSON.stringify({ featured }),
      });
    },
  },

  uploads: {
    async uploadImage(file: File): Promise<{ url: string; publicId: string }> {
      const formData = new FormData();
      formData.append("file", file);

      let token: string | null = null;
      if (typeof window !== "undefined") {
        token = localStorage.getItem("contextnode_token");
      }

      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/uploads/image`, {
        method: "POST",
        headers,
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Failed to upload image to Cloudinary");
      }

      return response.json();
    },
  },
};

export interface ImagePromptVariation {
  id?: string;
  title: string;
  description?: string;
  prompt: string;
  previewImageUrl?: string;
  orderIndex?: number;
}

export interface ImagePrompt {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription?: string;
  promptFamily: "CREATIVE" | "DEVELOPMENT";
  promptType: "IMAGE" | "VIDEO" | "DEVELOPMENT" | "CODING" | "CREATIVE" | "PRODUCTIVITY" | "OTHER";
  prompt: string;
  negativePrompt?: string;
  previewImageUrl?: string;
  previewContent?: string;
  aiTool?: string;
  model?: string;
  aspectRatio?: string;
  style?: string;
  useCase?: string;
  category: string;
  tags: string[];
  accessType: "FREE" | "PAID";
  price: number;
  featured: boolean;
  status: "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "REJECTED" | "ARCHIVED";
  adminFeedback?: string | null;
  reviewedById?: string | null;
  reviewedAt?: string | null;
  seoTitle?: string;
  seoDescription?: string;
  ogImageUrl?: string;
  viewsCount: number;
  downloadsCount: number;
  authorId: string;
  author?: {
    id: string;
    name: string;
    email?: string;
    avatar?: string | null;
  };
  variations?: ImagePromptVariation[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateImagePromptPayload {
  title: string;
  slug?: string;
  shortDescription: string;
  fullDescription?: string;
  prompt: string;
  negativePrompt?: string;
  previewImageUrl?: string;
  previewContent?: string;
  aiTool?: string;
  model?: string;
  aspectRatio?: string;
  style?: string;
  useCase?: string;
  category: string;
  tags?: string[];
  variations?: Array<{
    title: string;
    description?: string;
    prompt: string;
    previewImageUrl?: string;
    orderIndex?: number;
  }>;
  accessType?: "FREE" | "PAID";
  price?: number;
  featured?: boolean;
  status?: "DRAFT" | "PENDING_REVIEW";
  seoTitle?: string;
  seoDescription?: string;
  ogImageUrl?: string;
}

