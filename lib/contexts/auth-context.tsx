"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { login as loginApi, register as registerApi } from "@/lib/api/services/auth";

interface User {
  id: string | number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (phoneNumber: string, password: string) => Promise<void>;
  register: (phoneNumber: string, firstName: string, lastName: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error loading user from storage:", error);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (phoneNumber: string, password: string) => {
    try {
      const response = await loginApi(phoneNumber, password);
      
      if (!response || !response.user) {
        throw new Error("پاسخ نامعتبر از سرور");
      }

      const userData: User = {
        id: response.user.id,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        phoneNumber: response.user.phoneNumber,
        token: response.token,
      };
      
      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      
      // Redirect to home
      router.push(ROUTES.HOME);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }, [router]);

  const register = useCallback(async (
    phoneNumber: string,
    firstName: string,
    lastName: string,
    password: string
  ) => {
    try {
      const response = await registerApi(phoneNumber, firstName, lastName, password);
      
      if (!response || !response.user) {
        throw new Error("پاسخ نامعتبر از سرور");
      }

      const userData: User = {
        id: response.user.id,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        phoneNumber: response.user.phoneNumber,
        token: response.token,
      };
      
      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      
      // Redirect to home
      router.push(ROUTES.HOME);
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    router.push(ROUTES.HOME);
  }, [router]);

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

