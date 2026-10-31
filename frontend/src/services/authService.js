import { mockUsers } from "../data/mockData";
import { mockDelay, createApiResponse, createApiError } from "./apiClient";

const STORAGE_KEY = "valenceiq_auth_user";
const LEGACY_STORAGE_KEY = "brightloop_auth_user";

class AuthService {
  constructor() {
    this.users = [...mockUsers];
    const savedUser = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    this.currentUser = savedUser ? JSON.parse(savedUser) : this.users[0]; // Default to Admin
  }

  async login(email, password) {
    await mockDelay();
    const user = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw createApiError("Invalid credentials. Try demo accounts below.", 401);
    }
    // In Phase 1 mock auth, any password with >= 6 chars is accepted
    if (!password || password.length < 6) {
      throw createApiError("Password must be at least 6 characters.", 400);
    }
    this.currentUser = user;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return createApiResponse(user, "Login successful");
  }

  async register(userData) {
    await mockDelay();
    const existing = this.users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw createApiError("An account with this email already exists.", 400);
    }
    const newUser = {
      id: `usr_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role || "customer",
      title: userData.title || "Subscriber",
      phone: userData.phone || "+91 90000 00000",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    };
    this.users.push(newUser);
    this.currentUser = newUser;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return createApiResponse(newUser, "Account created successfully");
  }

  async switchRole(roleName) {
    await mockDelay(50);
    const user = this.users.find((u) => u.role === roleName) || this.users[0];
    this.currentUser = user;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return createApiResponse(user, `Switched to ${roleName.toUpperCase()} role`);
  }

  getCurrentUser() {
    return this.currentUser;
  }

  async logout() {
    await mockDelay(50);
    // Switch to unauthenticated or stay on login
    localStorage.removeItem(STORAGE_KEY);
    this.currentUser = null;
    return createApiResponse(null, "Logged out successfully");
  }

  async forgotPassword(email) {
    await mockDelay();
    return createApiResponse(
      { email },
      "Password reset instructions have been dispatched to your email (Mock Demonstration)."
    );
  }

  async resetPassword(token, newPassword) {
    await mockDelay();
    return createApiResponse(null, "Password successfully updated. You may now log in.");
  }
}

export const authService = new AuthService();
