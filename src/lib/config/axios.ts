import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import Cookies from "js-cookie";

// Define types for the API responses
export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export interface ApiError {
  error: string;
}

// Cookie names configuration
const COOKIE_NAMES = {
  USER_TOKEN: 'equiwings-customer-token',
  ADMIN_TOKEN: 'equiwings-admin-token'
} as const;

// Helper function to determine token type based on request URL
const getTokenType = (url: string = ''): 'user' | 'admin' => {
  return url.includes('/admin/') ? 'admin' : 'user';
};

// Helper function to get appropriate token
const getToken = (tokenType: 'user' | 'admin'): string | undefined => {
  if (typeof window === 'undefined') return undefined;

  return tokenType === 'admin'
    ? Cookies.get(COOKIE_NAMES.ADMIN_TOKEN)
    : Cookies.get(COOKIE_NAMES.USER_TOKEN);
};

// Helper function to remove tokens and redirect
const handleUnauthorized = (tokenType: 'user' | 'admin') => {
  if (typeof window === 'undefined') return;

  if (tokenType === 'admin') {
    Cookies.remove(COOKIE_NAMES.ADMIN_TOKEN);
    // Uncomment if you want automatic redirect on 401
    // window.location.href = '/admin/login';
  } else {
    Cookies.remove(COOKIE_NAMES.USER_TOKEN);
    // Uncomment if you want automatic redirect on 401
    // window.location.href = '/login';
  }
};

// Create base axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Determine which token to use based on the request URL
    const tokenType = getTokenType(config.url);
    const token = getToken(tokenType);

    // Add auth token if available
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add token type to config for use in response interceptor
    config.metadata = { tokenType };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access based on the original request's token type
      const tokenType = error.config?.metadata?.tokenType || 'user';
      handleUnauthorized(tokenType);
    }
    return Promise.reject(error);
  }
);

// Create separate instances for explicit user and admin usage
export const userAxiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const adminAxiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User instance interceptors
userAxiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken('user');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

userAxiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      handleUnauthorized('user');
    }
    return Promise.reject(error);
  }
);

// Admin instance interceptors
adminAxiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken('admin');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

adminAxiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      handleUnauthorized('admin');
    }
    return Promise.reject(error);
  }
);

// Utility functions for token management
export const tokenUtils = {
  // Set tokens
  setUserToken: (token: string) => {
    Cookies.set(COOKIE_NAMES.USER_TOKEN, token, { secure: true, sameSite: 'strict' });
  },

  setAdminToken: (token: string) => {
    Cookies.set(COOKIE_NAMES.ADMIN_TOKEN, token, { secure: true, sameSite: 'strict' });
  },

  // Get tokens
  getUserToken: () => getToken('user'),
  getAdminToken: () => getToken('admin'),

  // Remove tokens
  removeUserToken: () => Cookies.remove(COOKIE_NAMES.USER_TOKEN),
  removeAdminToken: () => Cookies.remove(COOKIE_NAMES.ADMIN_TOKEN),

  // Check if tokens exist
  hasUserToken: () => !!getToken('user'),
  hasAdminToken: () => !!getToken('admin'),

  // Clear all tokens
  clearAllTokens: () => {
    Cookies.remove(COOKIE_NAMES.USER_TOKEN);
    Cookies.remove(COOKIE_NAMES.ADMIN_TOKEN);
  }
};

// Export the main instance as default
export default axiosInstance;

// Extend the AxiosRequestConfig interface to include metadata
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      tokenType: 'user' | 'admin';
    };
  }
}