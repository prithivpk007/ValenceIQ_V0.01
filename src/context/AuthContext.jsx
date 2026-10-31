import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [role, setRole] = useState(authService.getCurrentUser()?.role || "admin");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const current = authService.getCurrentUser();
    if (current) {
      setUser(current);
      setRole(current.role);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      setUser(res.data);
      setRole(res.data.role);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authService.register(userData);
      setUser(res.data);
      setRole(res.data.role);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const switchRole = async (targetRole) => {
    setLoading(true);
    try {
      const res = await authService.switchRole(targetRole);
      setUser(res.data);
      setRole(res.data.role);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        switchRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
