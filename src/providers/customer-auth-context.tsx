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

interface CustomerAuthContextType {
  customer: User | null;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  fetchCustomer: () => Promise<void>;
  logout: () => Promise<void>;
  cartItems: any[];
  fetchCart: () => void
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(Cookies.get("equiwings-customer-token") || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartItems, setCartItems] = useState([])
  const [customer, setCustomer] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchCustomer = async () => {
    try {
      const res = await axiosInstance.get("/customers/profile");
      setCustomer(res.data.profile);
      setIsAuthenticated(true);
    } catch (err) {
      setCustomer(null);
      setIsAuthenticated(false);
      // Remove invalid token if API call fails
      Cookies.remove("equiwings-customer-token");
      setToken(null);
    } finally {
      setIsLoading(false); // Add this line
    }
  };

  useEffect(() => {
    if (token) {
      fetchCustomer();
      fetchCart();
    } else {
      setIsLoading(false);
    }
  }, [token]);


  // Fetch cart
  const fetchCart = async () => {
    const res = await axiosInstance.get("/customers/cart")
      .then((response) => {
        setCartItems(response.data.cart.items);
      })
      .catch((error) => {
        console.log(error);
      });
  }


  const login = async (token: string) => {
    try {
      Cookies.set("equiwings-customer-token", token, { expires: 1 });
      setToken(token);
      router.push("/sports-retail");
    } catch (err) {
      console.error("Login failed:", err);
      throw err; // Re-throw to handle in calling component
    }
  };

  const logout = async () => {
    try {
      Cookies.remove("equiwings-customer-token");
      setCustomer(null);
      setToken(null);
      setIsAuthenticated(false);
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (isLoading) return <Loader2 />

  return (
    <CustomerAuthContext.Provider value={{ customer, isAuthenticated, login, logout, fetchCustomer, cartItems, fetchCart }}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) throw new Error("useAuth must be used within CustomerAuthProvider");
  return context;
};