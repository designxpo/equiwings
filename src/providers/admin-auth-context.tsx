"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "@/lib/config/axios";
import Cookies from "js-cookie";
import Loader2 from "@/utils/loaders";
import { useRouter } from "next/navigation";

// Updated interface to match your User structure
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  role: {
    _id: string;
    name: string;
  };
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AdminAuthContextType {
  admin: User | null;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  fetchAdmin: () => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(Cookies.get("equiwings-admin-token") || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchAdmin = async () => {
    try {
      const res = await axiosInstance.get("/admin/profile");
      setAdmin(res.data.profile);
      setIsAuthenticated(true);
    } catch (err) {
      setAdmin(null);
      setIsAuthenticated(false);
      // Remove invalid token if API call fails
      Cookies.remove("equiwings-admin-token");
      setToken(null);
    } finally {
      setIsLoading(false); // Add this line
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdmin();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = async (token: string) => {
    try {
      Cookies.set("equiwings-admin-token", token, { expires: 1 });
      setToken(token);
      router.push("/admin/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      throw err; // Re-throw to handle in calling component
    }
  };

  const logout = async () => {
    try {
      Cookies.remove("equiwings-admin-token");
      setAdmin(null);
      setToken(null);
      setIsAuthenticated(false);
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (isLoading) return <Loader2 />

  return (
    <AdminAuthContext.Provider value={{ admin, isAuthenticated, login, logout, fetchAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error("useAuth must be used within AdminAuthProvider");
  return context;
};