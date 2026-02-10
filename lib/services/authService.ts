// lib/services/authService.ts

export const AuthService = {
  async login(email: string, password: string) {
    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async register(email: string, password: string) {
    const res = await fetch("/api/users/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async getMe() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const res = await fetch("/api/users/me", {
      headers: { Authorization: "Bearer " + token },
    });
    return res.json();
  },
};
