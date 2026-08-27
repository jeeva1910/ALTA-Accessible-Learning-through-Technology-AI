/**
 * Client-Side API Helper
 * Securely communicates with the backend Express server (which connects to MongoDB Atlas).
 * All database credentials and connection URIs remain strictly protected server-side.
 */

export interface DbStatusResponse {
  isConnected: boolean;
  state: "disconnected" | "connecting" | "connected" | "disconnecting" | "error";
  host?: string;
  name?: string;
  error?: string;
  collections?: {
    users?: number;
    lessons?: number;
    generated_content?: number;
    tactile_diagrams?: number;
    notes?: number;
    chat_history?: number;
    processing_history?: number;
  };
  timestamp?: string;
}

// In-memory / session storage for JWT token
let activeAuthToken: string | null = typeof window !== "undefined" ? sessionStorage.getItem("alta_auth_token") : null;

export const altaApi = {
  setToken(token: string | null) {
    activeAuthToken = token;
    if (typeof window !== "undefined") {
      if (token) {
        sessionStorage.setItem("alta_auth_token", token);
      } else {
        sessionStorage.removeItem("alta_auth_token");
      }
    }
  },

  getToken(): string | null {
    return activeAuthToken;
  },

  getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (activeAuthToken) {
      headers["Authorization"] = `Bearer ${activeAuthToken}`;
    }
    return headers;
  },

  /**
   * Authentication
   */
  async login(payload: { email?: string; password?: string }) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        this.setToken(data.token);
      }
      return { ok: res.ok, status: res.status, ...data };
    } catch (err: any) {
      return { ok: false, success: false, error: err?.message || "Failed to login" };
    }
  },

  async register(payload: { email: string; password: string; name?: string; role?: string; preferredMode?: string }) {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        this.setToken(data.token);
      }
      return { ok: res.ok, status: res.status, ...data };
    } catch (err: any) {
      return { ok: false, success: false, error: err?.message || "Failed to register" };
    }
  },

  async getCurrentUser() {
    try {
      const res = await fetch("/api/auth/me", {
        headers: this.getAuthHeaders(),
      });
      return await res.json();
    } catch {
      return { authenticated: false };
    }
  },

  /**
   * Check MongoDB backend status
   */
  async getDatabaseStatus(): Promise<DbStatusResponse> {
    try {
      const res = await fetch("/api/db/status", {
        headers: this.getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err: any) {
      return {
        isConnected: false,
        state: "error",
        error: err?.message || "Failed to reach server",
      };
    }
  },

  /**
   * Notes CRUD
   */
  async getNotes(params?: { userId?: string; subject?: string; isFavorite?: boolean }) {
    const query = new URLSearchParams();
    if (params?.userId) query.set("userId", params.userId);
    if (params?.subject) query.set("subject", params.subject);
    if (params?.isFavorite !== undefined) query.set("isFavorite", String(params.isFavorite));

    const res = await fetch(`/api/notes?${query.toString()}`, {
      headers: this.getAuthHeaders(),
    });
    return res.json();
  },

  async saveNote(note: {
    noteId?: string;
    title: string;
    content: string;
    brailleContent?: string;
    audioRecordingUrl?: string;
    subject?: string;
    tags?: string[];
    userId?: string;
    isFavorite?: boolean;
    sourceType?: string;
  }) {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(note),
    });
    return res.json();
  },

  async deleteNote(noteId: string) {
    const res = await fetch(`/api/notes/${encodeURIComponent(noteId)}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    return res.json();
  },

  /**
   * Lessons CRUD
   */
  async getLessons(params?: { subject?: string; mode?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.subject) query.set("subject", params.subject);
    if (params?.mode) query.set("mode", params.mode);
    if (params?.search) query.set("search", params.search);

    const res = await fetch(`/api/lessons?${query.toString()}`, {
      headers: this.getAuthHeaders(),
    });
    return res.json();
  },

  async getLessonById(lessonId: string) {
    const res = await fetch(`/api/lessons/${encodeURIComponent(lessonId)}`, {
      headers: this.getAuthHeaders(),
    });
    return res.json();
  },

  async createLesson(lesson: any) {
    const res = await fetch("/api/lessons", {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(lesson),
    });
    return res.json();
  },

  /**
   * Tactile Diagrams
   */
  async getTactileDiagrams(params?: { category?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.category) query.set("category", params.category);
    if (params?.search) query.set("search", params.search);

    const res = await fetch(`/api/tactile-diagrams?${query.toString()}`, {
      headers: this.getAuthHeaders(),
    });
    return res.json();
  },

  async createTactileDiagram(diagram: any) {
    const res = await fetch("/api/tactile-diagrams", {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(diagram),
    });
    return res.json();
  },

  /**
   * Generated Content (Data Minimization: only results & metadata saved)
   */
  async getGeneratedContent(params?: { contentType?: string; userId?: string; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.contentType) query.set("contentType", params.contentType);
    if (params?.userId) query.set("userId", params.userId);
    if (params?.limit) query.set("limit", String(params.limit));

    const res = await fetch(`/api/generated-content?${query.toString()}`, {
      headers: this.getAuthHeaders(),
    });
    return res.json();
  },

  async saveGeneratedContent(content: any) {
    const res = await fetch("/api/generated-content", {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(content),
    });
    return res.json();
  },

  /**
   * Ephemeral File Upload & Processing
   */
  async uploadAndProcessFile(payload: { fileName: string; fileType: string; fileData: string; targetService?: string }) {
    const res = await fetch("/api/files/upload", {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  /**
   * Chat History
   */
  async getChatHistory(sessionId: string) {
    const res = await fetch(`/api/chat-history/${encodeURIComponent(sessionId)}`, {
      headers: this.getAuthHeaders(),
    });
    return res.json();
  },

  async saveChatMessage(sessionId: string, message: any, metadata?: any) {
    const res = await fetch("/api/chat-history", {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ sessionId, message, ...metadata }),
    });
    return res.json();
  },
};

export default altaApi;
